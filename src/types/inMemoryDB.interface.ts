import { Favorites } from './favorites.interface';
import { Artist } from './artists.interface';
import { Album } from './albums.interface';
import { ITrack } from './tracks.interface';
import { IUser } from './users.interface';

export interface Database {
  favorites: Favorites;
  artists: Artist[];
  tracks: ITrack[];
  albums: Album[];
  users: IUser[];
}
