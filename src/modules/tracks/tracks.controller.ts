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
import { TracksService } from './services/tracks.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { ITrack } from './../../types/tracks.interface';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getTracks(): Promise<ITrack[]> {
    return this.tracksService.getTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrack(@Param('id') id: string): Promise<ITrack> {
    return this.tracksService.getTrack(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto): Promise<ITrack> {
    return this.tracksService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<ITrack> {
    return this.tracksService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string): Promise<void> {
    return this.tracksService.deleteTrack(id);
  }
}
