import {
  ValidateIf,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name: string;

  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;

  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  @IsOptional()
  duration: number;
}
