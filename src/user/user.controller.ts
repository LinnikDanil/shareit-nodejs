import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UserService } from "./user.service";
import { User } from "./User";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  findAll(): User[] {
    return this.userService.findAllUsers();
  }

  @Get(":id")
  findOne(@Param("id") id: string): User {
    return this.userService.findUserById(parseInt(id, 10));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() userCreateDto: UserCreateDto): User {
    return this.userService.createUser(userCreateDto);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Param("id") id: string, @Body() userUpdateDto: UserUpdateDto): User {
    return this.userService.updateUser(parseInt(id, 10), userUpdateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string): void {
    this.userService.deleteUser(parseInt(id, 10));
  }
}