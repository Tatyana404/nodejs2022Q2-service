import { Artist } from '@prisma/client';
import { Album } from '@prisma/client';
import { Track } from '@prisma/client';

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
