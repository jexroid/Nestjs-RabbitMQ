import { IsAlpha, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(2)
  readonly id: string;

  @IsString()
  @IsAlpha()
  @MinLength(2)
  readonly job: string;

  @IsString()
  @IsOptional()
  readonly avatar: string;
}
