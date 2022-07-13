import { Injectable } from '@nestjs/common';
import { Artist } from './../types/artists.interface';

@Injectable()
export class InMemoryDB {
  static artists: Artist[] = [];
}
