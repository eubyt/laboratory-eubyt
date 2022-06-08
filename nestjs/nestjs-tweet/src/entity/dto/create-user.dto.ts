import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 16)
  @Matches(/^[A-z0-9]+$/, { message: 'Username must be alphanumeric' })
  @IsNotEmpty()
  readonly displayName: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  readonly password: string;
}
