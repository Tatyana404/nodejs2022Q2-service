import {
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;
}
