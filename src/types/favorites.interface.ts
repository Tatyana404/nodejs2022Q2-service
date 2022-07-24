import { Artist } from './artists.interface';
import { Album } from './albums.interface';
import { Track } from './tracks.interface';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
