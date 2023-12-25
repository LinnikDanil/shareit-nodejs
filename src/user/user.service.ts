import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./User";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  private id: number = 0;

  createUser(userCreateDto: UserCreateDto): User {
    //Проверка на существующего пользователя
    const currentUser: User = this.users.find(user => user.email === userCreateDto.email);
    if (currentUser) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    //Создание пользователя
    const newUser: User = {
      id: this.getNewId(),
      name: userCreateDto.name,
      email: userCreateDto.email
    };

    //Сохранение пользователя
    this.users.push(newUser);

    return newUser;
  }

  findUserById(id: number): User | undefined {
    const currentUser: User = this.users.find(user => user.id === id);
    return currentUser;
  }

  findAllUsers(): User[] {
    return this.users;
  }

  updateUser(id: number, userUpdateDto: UserUpdateDto): User {
    //Поиск индекса в массиве (существование пользователя)
    const userIndex = this.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`Пользователь с id = ${id} не найден`);
    }

    //Присваивания пользователя из списка по индексу массива
    const currentUser = this.users[userIndex];

    //Проверка на существование пользователя с таким email (кроме текущего пользователя)
    const userWithEmail: User = this.users.find(user => user.email === userUpdateDto.email);
    if (userWithEmail && currentUser.id !== userWithEmail.id) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    //Обновление пользователя
    const updatedUser: User = {
      id: currentUser.id,
      name: userUpdateDto.name ?? currentUser.name,
      email: userUpdateDto.email ?? currentUser.email
    };

    //Смена пользователя в массиве на обновлённого
    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  deleteUser(id: number): void {
    const userIndex = this.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`Пользователь с id = ${id} не найден`);
    }

    this.users.splice(userIndex, 1);
  }

  private getNewId(): number {
    return ++this.id;
  }
}
