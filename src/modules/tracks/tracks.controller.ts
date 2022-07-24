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
import { Track } from '@prisma/client';
import { TracksService } from './services/tracks.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getTracks(): Promise<Track[]> {
    return this.tracksService.getTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrack(@Param('id') id: string): Promise<Track> {
    return this.tracksService.getTrack(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.tracksService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string): Promise<void> {
    return this.tracksService.deleteTrack(id);
  }
}
