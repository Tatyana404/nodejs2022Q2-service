import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Album } from '@prisma/client';
import { PrismaService } from './../../prisma/services/prisma.service';
import { CreateAlbumDto } from './../dto/create-album.dto';
import { UpdateAlbumDto } from './../dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async getAlbums(): Promise<Album[]> {
    Logger.debug(AlbumsService.name, 'getAlbums getting started');
    Logger.debug(AlbumsService.name, 'getAlbums completion work');
    return await this.prisma.album.findMany();
  }

  async getAlbum(albumId: string): Promise<Album> {
    Logger.debug(AlbumsService.name, 'getAlbum getting started');

    if (!uuidValidate(albumId)) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    if (!album) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.NOT_FOUND} Album ${albumId} not found`,
      );
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    Logger.debug(AlbumsService.name, 'getAlbum completion work');
    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    Logger.debug(AlbumsService.name, 'createAlbum getting started');

    if (createAlbumDto.artistId) {
      if (
        !(await this.prisma.artist.findUnique({
          where: { id: createAlbumDto.artistId },
        }))
      ) {
        Logger.error(
          `${AlbumsService.name} ${HttpStatus.UNPROCESSABLE_ENTITY} Artist ${createAlbumDto.artistId} not found`,
        );
        throw new UnprocessableEntityException(
          `Artist ${createAlbumDto.artistId} not found`,
        );
      }
    }

    if (!['name', 'year'].every((field: string) => field in createAlbumDto)) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.BAD_REQUEST} Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }

    const newAlbum: Album = await this.prisma.album.create({
      data: { ...createAlbumDto },
    });

    Logger.debug(AlbumsService.name, 'createAlbum completion work');
    return newAlbum;
  }

  async updateAlbum(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    Logger.debug(AlbumsService.name, 'updateAlbum getting started');

    if (!uuidValidate(albumId)) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    const album: Album = await this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    if (!album) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.NOT_FOUND} Album ${albumId} not found`,
      );
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    const updateAlbum: Album = await this.prisma.album.update({
      where: {
        id: albumId,
      },
      data: { ...updateAlbumDto },
    });

    Logger.debug(AlbumsService.name, 'updateAlbum completion work');
    return updateAlbum;
  }

  async deleteAlbum(albumId: string): Promise<void> {
    Logger.debug(AlbumsService.name, 'deleteAlbum getting started');

    if (!uuidValidate(albumId)) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.BAD_REQUEST} Album id ${albumId} invalid`,
      );
      throw new BadRequestException(`Album id ${albumId} invalid`);
    }

    if (!(await this.prisma.album.findUnique({ where: { id: albumId } }))) {
      Logger.error(
        `${AlbumsService.name} ${HttpStatus.NOT_FOUND} Track ${albumId} not found`,
      );
      throw new NotFoundException(`Track ${albumId} not found`);
    }

    await this.prisma.album.delete({
      where: {
        id: albumId,
      },
    });

    Logger.debug(AlbumsService.name, 'deleteAlbum completion work');
  }
}
