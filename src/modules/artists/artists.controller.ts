import { UpdateArtistDto } from './dto/update-artist.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistsService } from './services/artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './../../types/artists.interface';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getArtists(): Promise<Artist[]> {
    return this.artistsService.getArtists();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getArtist(@Param('id') id: string): Promise<Artist> {
    return this.artistsService.getArtist(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistsService.createArtist(createArtistDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateArtist(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateArtistDto,
  ): Promise<Artist> {
    return this.artistsService.updateArtist(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string): Promise<any> {
    return this.artistsService.deleteArtist(id);
  }
}
