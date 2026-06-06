import { Module } from "@nestjs/common";
import { GamesModule } from "../games/games.module";
import { HistoryController } from "./history.controller";

@Module({
  imports: [GamesModule],
  controllers: [HistoryController],
})
export class HistoryModule {}
