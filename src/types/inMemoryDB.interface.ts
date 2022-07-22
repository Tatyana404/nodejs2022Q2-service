import { Favorites } from './favorites.interface';
import { Artist } from './artists.interface';
import { Album } from './albums.interface';
import { Track } from './tracks.interface';
import { IUser } from './users.interface';

export interface Database {
  favorites: Favorites;
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  users: IUser[];
}
