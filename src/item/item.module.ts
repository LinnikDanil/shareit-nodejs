import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {
}
