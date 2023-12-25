import { IsBoolean, IsOptional, IsString } from "class-validator";

export class ItemUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  available: boolean;
}