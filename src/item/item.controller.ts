import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Req,
  HttpException,
  HttpStatus, UsePipes, ValidationPipe
} from "@nestjs/common";
import { ItemService } from './item.service';
import { Request } from 'express';
import { Item } from "./Item";
import { ItemCreateDto } from "./dto/item-create.dto";
import { ItemUpdateDto } from "./dto/item-update.dto";

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() itemCreateDto: ItemCreateDto, @Req() request: Request): Item {
    const userId = request.headers['x-sharer-user-id'] as string;
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.itemService.createItem(itemCreateDto, parseInt(userId, 10));
  }

  @Patch(':itemId')
  @UsePipes(new ValidationPipe())
  update(@Param('itemId') itemId: string, @Body() itemUpdateDto: ItemUpdateDto, @Req() request: Request): Item {
    const userId = request.headers['x-sharer-user-id'] as string;
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.itemService.updateItem(parseInt(itemId, 10), itemUpdateDto, parseInt(userId, 10));
  }

  @Get('search')
  search(@Query('text') text: string): Item[] {
    return this.itemService.searchItems(text);
  }

  @Get(':itemId')
  findOne(@Param('itemId') itemId: string): Item {
    return this.itemService.findItemById(parseInt(itemId, 10));
  }

  @Get()
  findAll(@Req() request: Request): Item[] {
    const userId = request.headers['x-sharer-user-id'] as string;
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.itemService.findAllItemsByUser(parseInt(userId, 10));
  }
}
