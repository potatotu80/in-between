import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AdminAuditLogEntity } from "./database/entities/admin-audit-log.entity";
import { GameRoundEntity } from "./database/entities/game-round.entity";
import { GameSessionEntity } from "./database/entities/game-session.entity";
import { UserEntity } from "./database/entities/user.entity";
import { WalletEntity } from "./database/entities/wallet.entity";
import { WalletTransactionEntity } from "./database/entities/wallet-transaction.entity";
import { DatabaseSeedService } from "./database/seed.service";
import { AdminModule } from "./modules/admin/admin.module";
import { AuthModule } from "./modules/auth/auth.module";
import { GamesModule } from "./modules/games/games.module";
import { HealthModule } from "./modules/health/health.module";
import { HistoryModule } from "./modules/history/history.module";
import { LobbyModule } from "./modules/lobby/lobby.module";
import { UsersModule } from "./modules/users/users.module";
import { WalletsModule } from "./modules/wallets/wallets.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres" as const,
        host: configService.get<string>("POSTGRES_HOST", "localhost"),
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER", "postgres"),
        password: configService.get<string>("POSTGRES_PASSWORD", "postgres"),
        database: configService.get<string>("POSTGRES_DB", "in_between"),
        entities: [
          UserEntity,
          WalletEntity,
          WalletTransactionEntity,
          GameSessionEntity,
          GameRoundEntity,
          AdminAuditLogEntity,
        ],
        autoLoadEntities: true,
        synchronize: false,
        migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
        migrationsRun: configService.get<string>("RUN_MIGRATIONS", "false") === "true",
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    WalletsModule,
    LobbyModule,
    GamesModule,
    HistoryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [DatabaseSeedService],
})
export class AppModule {}
