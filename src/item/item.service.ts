import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Item } from "./Item";
import { ItemCreateDto } from "./dto/item-create.dto";
import { ItemUpdateDto } from "./dto/item-update.dto";
import It = jest.It;
import { UserService } from "../user/user.service";
import { User } from "../user/User";
import { ItemController } from "./item.controller";

@Injectable()
export class ItemService {
  private readonly items: Item[] = [];
  private id: number = 0;

  constructor(private readonly userService: UserService) {
  }

  createItem(itemCreateDto: ItemCreateDto, userId: number): Item {
    const currentUser = this.userService.findUserById(userId);

    if (!currentUser) {
      throw new NotFoundException(`Пользователь с id = ${userId} не существует.`);
    }

    const newItem : Item = {
      id: this.getNewId(),
      name: itemCreateDto.name,
      description: itemCreateDto.description,
      available: itemCreateDto.available,
      userId: userId
    }

    this.items.push(newItem);

    return newItem;
  }

  updateItem(itemId: number, itemUpdateDto: ItemUpdateDto, userId: number): Item {
    const currentUser = this.userService.findUserById(userId);
    if (!currentUser) {
      throw new NotFoundException(`Пользователь с id = ${userId} не существует.`);
    }

    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Предмет с id = ${itemId} не найден`);
    }
    const currentItem = this.items[itemIndex];

    if (currentItem.userId !== userId) {
      throw new NotFoundException(`У предмета с id = ${itemId} владелец с id = ${currentItem.userId}, а не ${userId}`)
    }

    const updatedItem: Item = {
      id: currentItem.id,
      name: itemUpdateDto.name ?? currentItem.name,
      description: itemUpdateDto.description ?? currentItem.description,
      available: itemUpdateDto.available ?? currentItem.available,
      userId: userId
    }

    this.items[itemIndex] = updatedItem;

    return updatedItem;
  }

  findItemById(itemId: number): Item {
    const currentItem: Item = this.items.find(item => item.id === itemId);
    return currentItem;
  }

  findAllItemsByUser(userId: number): Item[] {
    const currentUser = this.userService.findUserById(userId);
    if (!currentUser) {
      throw new NotFoundException(`Пользователь с id = ${userId} не существует.`);
    }

    const items: Item[] = this.items.filter(item => item.userId === userId);

    return items;
  }

  searchItems(text: string): Item[] {
    if (!text) return [];

    text = text.toLowerCase();

    return this.items.filter(item =>
      (item.name.toLowerCase().includes(text) || item.description.toLowerCase().includes(text)) &&
      item.available
    );
  }

  private getNewId(): number {
    return ++this.id;
  }
}
