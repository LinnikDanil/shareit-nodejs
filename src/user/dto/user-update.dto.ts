import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;
}