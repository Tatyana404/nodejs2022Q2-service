import { Injectable } from '@nestjs/common';
import { Favorites } from './../types/favorites.interface';
import { Artist } from './../types/artists.interface';
import { Track } from './../types/tracks.interface';
import { Album } from './../types/albums.interface';
import { User } from './../types/users.interface';

@Injectable()
export class InMemoryDB {
  static favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
  static artists: Artist[] = [];
  static tracks: Track[] = [];
  static albums: Album[] = [];
  static users: User[] = [];
}
