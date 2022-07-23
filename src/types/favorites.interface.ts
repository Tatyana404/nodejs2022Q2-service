import { IArtist } from './artists.interface';
import { Album } from './albums.interface';
import { Track } from '@prisma/client';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesRepsonse {
  artists: IArtist[];
  albums: Album[];
  tracks: Track[];
}
