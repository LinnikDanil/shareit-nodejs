import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ItemCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  available: boolean;
}