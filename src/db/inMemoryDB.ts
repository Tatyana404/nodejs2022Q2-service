import { Injectable } from '@nestjs/common';
import { Favorites } from './../types/favorites.interface';
import { Database } from './../types/inMemoryDB.interface';
import { Artist } from './../types/artists.interface';
import { ITrack } from './../types/tracks.interface';
import { Album } from './../types/albums.interface';
import { IUser } from './../types/users.interface';

@Injectable()
export class InMemoryDB {
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: ITrack[] = [];
  users: IUser[] = [];

  private static instance: Database;

  constructor() {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = this;
    }

    return InMemoryDB.instance;
  }
}
