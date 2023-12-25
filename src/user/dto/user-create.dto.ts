import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserCreateDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}