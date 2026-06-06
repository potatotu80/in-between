import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletEntity } from "../../database/entities/wallet.entity";
import { WalletTransactionEntity } from "../../database/entities/wallet-transaction.entity";
import { WalletsController } from "./wallets.controller";
import { WalletsService } from "./wallets.service";

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, WalletTransactionEntity])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
