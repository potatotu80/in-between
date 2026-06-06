import { Module } from "@nestjs/common";
import { WalletsModule } from "../wallets/wallets.module";
import { LobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";

@Module({
  imports: [WalletsModule],
  controllers: [LobbyController],
  providers: [LobbyService],
  exports: [LobbyService],
})
export class LobbyModule {}
