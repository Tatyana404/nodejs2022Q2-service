import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Track } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrackDto } from './../dto/create-track.dto';
import { UpdateTrackDto } from './../dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async getTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async getTrack(trackId: string): Promise<Track> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.artistId) {
      if (
        !(await this.prisma.artist.findUnique({
          where: { id: createTrackDto.artistId },
        }))
      ) {
        throw new UnprocessableEntityException(
          `Artist ${createTrackDto.artistId} not found`,
        );
      }
    }

    if (createTrackDto.albumId) {
      if (
        !(await this.prisma.album.findUnique({
          where: { id: createTrackDto.albumId },
        }))
      ) {
        throw new UnprocessableEntityException(
          `Album ${createTrackDto.albumId} not found`,
        );
      }
    }

    if (
      !['name', 'duration'].every((field: string) => field in createTrackDto)
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newTrack: Track = await this.prisma.track.create({
      data: { ...createTrackDto },
    });

    return newTrack;
  }

  async updateTrack(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    const updateTrack: Track = await this.prisma.track.update({
      where: {
        id: trackId,
      },
      data: { ...updateTrackDto },
    });

    return updateTrack;
  }

  async deleteTrack(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (!(await this.prisma.track.findUnique({ where: { id: trackId } }))) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    await this.prisma.track.delete({
      where: {
        id: trackId,
      },
    });
  }
}
