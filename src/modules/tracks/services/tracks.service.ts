import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Track } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CustomLogger } from './../../logger/services/logger.service';
import { CreateTrackDto } from './../dto/create-track.dto';
import { UpdateTrackDto } from './../dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService, private logger: CustomLogger) {}

  async getTracks(): Promise<Track[]> {
    this.logger.debug('getTracks getting started');
    this.logger.debug('getTracks completion work');
    return await this.prisma.track.findMany();
  }

  async getTrack(trackId: string): Promise<Track> {
    this.logger.debug('getTrack getting started');

    if (!uuidValidate(trackId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Track ${trackId} not found`);
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    this.logger.debug('getTrack completion work');
    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    this.logger.debug('createTrack getting started');

    if (createTrackDto.artistId) {
      if (
        !(await this.prisma.artist.findUnique({
          where: { id: createTrackDto.artistId },
        }))
      ) {
        this.logger.error(
          `${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${createTrackDto.artistId} not found`,
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
        this.logger.error(
          `${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${createTrackDto.artistId} not found`,
        );
        throw new UnprocessableEntityException(
          `Album ${createTrackDto.albumId} not found`,
        );
      }
    }

    if (
      !['name', 'duration'].every((field: string) => field in createTrackDto)
    ) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newTrack: Track = await this.prisma.track.create({
      data: { ...createTrackDto },
    });

    this.logger.debug('createTrack completion work');
    return newTrack;
  }

  async updateTrack(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    this.logger.debug('updateTrack getting started');

    if (!uuidValidate(trackId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = await this.prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Track ${trackId} not found`);
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    const updateTrack: Track = await this.prisma.track.update({
      where: {
        id: trackId,
      },
      data: { ...updateTrackDto },
    });

    this.logger.debug('updateTrack completion work');
    return updateTrack;
  }

  async deleteTrack(trackId: string): Promise<void> {
    this.logger.debug('deleteTrack getting started');

    if (!uuidValidate(trackId)) {
      this.logger.error(
        `${HttpStatus.BAD_REQUEST} Track id ${trackId} invalid`,
      );
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (!(await this.prisma.track.findUnique({ where: { id: trackId } }))) {
      this.logger.error(`${HttpStatus.NOT_FOUND} Track ${trackId} not found`);
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    await this.prisma.track.delete({
      where: {
        id: trackId,
      },
    });

    this.logger.debug('deleteTrack completion work');
  }
}
