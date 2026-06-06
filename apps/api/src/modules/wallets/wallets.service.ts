import { randomUUID } from "crypto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { WalletTransactionType } from "@in-between/shared";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WalletEntity } from "../../database/entities/wallet.entity";
import { WalletTransactionEntity } from "../../database/entities/wallet-transaction.entity";

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsRepository: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly walletTransactionsRepository: Repository<WalletTransactionEntity>,
  ) {}

  async getWalletByUserId(userId: string) {
    const wallet = await this.walletsRepository.findOne({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }

    return this.toWalletResponse(wallet);
  }

  async getWalletEntityByUserId(userId: string) {
    const wallet = await this.walletsRepository.findOne({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }

    return wallet;
  }

  async listTransactionsByUserId(userId: string) {
    const wallet = await this.getWalletEntityByUserId(userId);
    const transactions = await this.walletTransactionsRepository.find({
      where: { walletId: wallet.id },
      order: { createdAt: "DESC" },
    });

    return transactions.map((transaction) => this.toTransactionResponse(transaction));
  }

  async applySettlement(input: {
    userId: string;
    amountDelta: number;
    gameRoundId: string;
    transactionType: WalletTransactionType;
    reference: string;
    metadata?: Record<string, unknown>;
  }) {
    const result = await this.walletsRepository.manager.transaction(async (manager) => {
      const walletsRepository = manager.getRepository(WalletEntity);
      const walletTransactionsRepository = manager.getRepository(WalletTransactionEntity);
      const wallet = await walletsRepository.findOne({
        where: { userId: input.userId },
      });

      if (!wallet) {
        throw new NotFoundException("Wallet not found");
      }

      const balanceBefore = Number(wallet.balance);
      const nextBalance = Number((balanceBefore + input.amountDelta).toFixed(2));

      if (nextBalance < 0) {
        throw new BadRequestException("Insufficient balance");
      }

      wallet.balance = nextBalance.toFixed(2);
      const savedWallet = await walletsRepository.save(wallet);

      const transaction = walletTransactionsRepository.create({
        id: randomUUID(),
        walletId: wallet.id,
        gameRoundId: input.gameRoundId,
        transactionType: input.transactionType,
        amount: input.amountDelta.toFixed(2),
        balanceBefore: balanceBefore.toFixed(2),
        balanceAfter: nextBalance.toFixed(2),
        reference: input.reference,
        metadata: input.metadata ?? null,
      });

      const savedTransaction = await walletTransactionsRepository.save(transaction);

      return {
        wallet: savedWallet,
        transaction: savedTransaction,
      };
    });

    return {
      wallet: this.toWalletResponse(result.wallet),
      transaction: this.toTransactionResponse(result.transaction),
    };
  }

  async createWallet(input: {
    id: string;
    userId: string;
    currency: string;
    balance: number;
    lockedBalance: number;
  }) {
    const wallet = this.walletsRepository.create({
      id: input.id,
      userId: input.userId,
      currency: input.currency,
      balance: input.balance.toFixed(2),
      lockedBalance: input.lockedBalance.toFixed(2),
    });

    return this.walletsRepository.save(wallet);
  }

  private toWalletResponse(wallet: WalletEntity) {
    return {
      id: wallet.id,
      userId: wallet.userId,
      currency: wallet.currency,
      balance: Number(wallet.balance),
      lockedBalance: Number(wallet.lockedBalance),
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  private toTransactionResponse(transaction: WalletTransactionEntity) {
    return {
      id: transaction.id,
      walletId: transaction.walletId,
      gameRoundId: transaction.gameRoundId,
      transactionType: transaction.transactionType,
      amount: Number(transaction.amount),
      balanceBefore: Number(transaction.balanceBefore),
      balanceAfter: Number(transaction.balanceAfter),
      reference: transaction.reference,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
    };
  }
}
