import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateTrackDto } from './../dto/create-track.dto';
import { UpdateTrackDto } from './../dto/update-track.dto';
import { Track } from './../../../types/tracks.interface';
import { InMemoryDB } from './../../../db/inMemoryDB';

@Injectable()
export class TracksService {
  constructor(private inMemoryDB: InMemoryDB) {}

  async getTracks(): Promise<Track[]> {
    return this.inMemoryDB.tracks;
  }

  async getTrack(trackId: string): Promise<Track> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const track: Track = this.inMemoryDB.tracks.find(
      ({ id }: { id: string }) => id === trackId,
    );

    if (!track) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.artistId) {
      if (
        !this.inMemoryDB.artists.find(
          ({ id }: { id: string }) => id === createTrackDto.artistId,
        )
      ) {
        throw new UnprocessableEntityException(
          `Artist ${createTrackDto.artistId} not found`,
        );
      }
    }

    if (createTrackDto.albumId) {
      if (
        !this.inMemoryDB.albums.find(
          ({ id }: { id: string }) => id === createTrackDto.albumId,
        )
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

    const newTrack: Track = {
      ...createTrackDto,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      id: uuidv4(),
    };

    this.inMemoryDB.tracks.push(newTrack);

    return newTrack;
  }

  async updateTrack(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    const index: number = this.inMemoryDB.tracks.findIndex(
      ({ id }: { id: string }) => id === trackId,
    );

    if (index === -1) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    const updateTrack: Track = { ...updateTrackDto, id: trackId };

    this.inMemoryDB.tracks[index] = updateTrack;

    return updateTrack;
  }

  async deleteTrack(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new BadRequestException(`Track id ${trackId} invalid`);
    }

    if (
      !this.inMemoryDB.tracks.find(({ id }: { id: string }) => id === trackId)
    ) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }

    this.inMemoryDB.tracks = this.inMemoryDB.tracks.filter(
      ({ id }: { id: string }) => id !== trackId,
    );

    if (
      this.inMemoryDB.favorites.tracks.findIndex(
        (id: string) => id === trackId,
      ) !== -1
    ) {
      this.inMemoryDB.favorites.tracks =
        this.inMemoryDB.favorites.tracks.filter((id: string) => id !== trackId);
    }
  }
}
