import { Injectable } from '@nestjs/common';
import { Favorites } from './../types/favorites.interface';
import { Database } from './../types/inMemoryDB.interface';
import { Artist } from './../types/artists.interface';
import { Track } from '@prisma/client';
import { Album } from './../types/albums.interface';
import { User } from '@prisma/client';

@Injectable()
export class InMemoryDB {
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: Track[] = [];
  users: User[] = [];

  private static instance: Database;

  constructor() {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = this;
    }

    return InMemoryDB.instance;
  }
}
