import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Track } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CreateTrackDto } from './../dto/create-track.dto';
import { UpdateTrackDto } from './../dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async getTracks(): Promise<Track[]> {
    Logger.debug(TracksService.name, 'getTracks getting started');
    Logger.debug(TracksService.name, 'getTracks completion work');
    return await this.prisma.track.findMany();
  }

  async getTrack(trackId: string): Promise<Track> {
    Logger.debug(TracksService.name, 'getTrack getting started');

    if (!uuidValidate(trackId)) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.NOT_FOUND} Track ${trackId} not found`,
      );
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    Logger.debug(TracksService.name, 'getTrack completion work');
    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    Logger.debug(TracksService.name, 'createTrack getting started');

    if (createTrackDto.artistId) {
      if (
        !(await this.prisma.artist.findUnique({
          where: { id: createTrackDto.artistId },
        }))
      ) {
        Logger.error(
          `${TracksService.name} ${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${createTrackDto.artistId} not found`,
        );
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
        Logger.error(
          `${TracksService.name} ${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${createTrackDto.artistId} not found`,
        );
        throw new UnprocessableEntityException(
          `Album ${createTrackDto.albumId} not found`,
        );
      }
    }

    if (
      !['name', 'duration'].every((field: string) => field in createTrackDto)
    ) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newTrack: Track = await this.prisma.track.create({
      data: { ...createTrackDto },
    });

    Logger.debug(TracksService.name, 'createTrack completion work');
    return newTrack;
  }

  async updateTrack(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    Logger.debug(TracksService.name, 'updateTrack getting started');

    if (!uuidValidate(trackId)) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.NOT_FOUND} Track ${trackId} not found`,
      );
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    const updateTrack: Track = await this.prisma.track.update({
      where: {
        id: trackId,
      },
      data: { ...updateTrackDto },
    });

    Logger.debug(TracksService.name, 'updateTrack completion work');
    return updateTrack;
  }

  async deleteTrack(trackId: string): Promise<void> {
    Logger.debug(TracksService.name, 'deleteTrack getting started');

    if (!uuidValidate(trackId)) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (!(await this.prisma.track.findUnique({ where: { id: trackId } }))) {
      Logger.error(
        `${TracksService.name} ${HttpStatus.NOT_FOUND} Track ${trackId} not found`,
      );
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    await this.prisma.track.delete({
      where: {
        id: trackId,
      },
    });

    Logger.debug(TracksService.name, 'deleteTrack completion work');
  }
}
