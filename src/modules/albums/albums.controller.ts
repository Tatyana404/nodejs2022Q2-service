import {
  Controller,
  HttpStatus,
  HttpCode,
  Delete,
  Param,
  Body,
  Post,
  Get,
  Put,
} from '@nestjs/common';
import { Album } from '@prisma/client';
import { AlbumsService } from './services/albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAlbums(): Promise<Album[]> {
    return this.albumsService.getAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAlbum(@Param('id') id: string): Promise<Album> {
    return this.albumsService.getAlbum(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumsService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumsService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string): Promise<void> {
    return this.albumsService.deleteAlbum(id);
  }
}
