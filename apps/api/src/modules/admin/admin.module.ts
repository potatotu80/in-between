import { Module } from "@nestjs/common";
import { GamesModule } from "../games/games.module";
import { UsersModule } from "../users/users.module";
import { WalletsModule } from "../wallets/wallets.module";
import { AdminController } from "./admin.controller";

@Module({
  imports: [GamesModule, UsersModule, WalletsModule],
  controllers: [AdminController],
})
export class AdminModule {}
