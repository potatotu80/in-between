import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameRoundEntity } from "../../database/entities/game-round.entity";
import { GameSessionEntity } from "../../database/entities/game-session.entity";
import { LobbyModule } from "../lobby/lobby.module";
import { WalletsModule } from "../wallets/wallets.module";
import { GameEngineService } from "./game-engine.service";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([GameSessionEntity, GameRoundEntity]),
    WalletsModule,
    LobbyModule,
  ],
  controllers: [GamesController],
  providers: [GameEngineService, GamesService],
  exports: [GamesService],
})
export class GamesModule {}
