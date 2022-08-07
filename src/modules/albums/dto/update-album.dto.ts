import {
  ValidateIf,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  year: number;

  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;
}
