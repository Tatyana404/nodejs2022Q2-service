import { Favorites } from './favorites.interface';
import { IArtist } from './artists.interface';
import { Album } from './albums.interface';
import { Track } from '@prisma/client';
import { IUser } from './users.interface';

export interface Database {
  favorites: Favorites;
  artists: IArtist[];
  tracks: Track[];
  albums: Album[];
  users: IUser[];
}
