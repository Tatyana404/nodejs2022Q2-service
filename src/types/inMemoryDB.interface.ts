import { Favorites } from './favorites.interface';
import { Artist } from '@prisma/client';
import { Album } from './albums.interface';
import { Track } from '@prisma/client';
import { User } from '@prisma/client';

export interface Database {
  favorites: Favorites;
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  users: User[];
}
