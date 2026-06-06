import "reflect-metadata";
import { DataSource } from "typeorm";
import { AdminAuditLogEntity } from "./entities/admin-audit-log.entity";
import { GameRoundEntity } from "./entities/game-round.entity";
import { GameSessionEntity } from "./entities/game-session.entity";
import { UserEntity } from "./entities/user.entity";
import { WalletEntity } from "./entities/wallet.entity";
import { WalletTransactionEntity } from "./entities/wallet-transaction.entity";
import { InitialSchema1710000000000 } from "./migrations/1710000000000-initial-schema";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "postgres",
  database: process.env.POSTGRES_DB ?? "in_between",
  entities: [
    UserEntity,
    WalletEntity,
    WalletTransactionEntity,
    GameSessionEntity,
    GameRoundEntity,
    AdminAuditLogEntity,
  ],
  migrations: [InitialSchema1710000000000],
});
