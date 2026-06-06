import { WalletTransactionType } from "@in-between/shared";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "wallet_transactions" })
export class WalletTransactionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "wallet_id", type: "uuid" })
  walletId!: string;

  @Column({ name: "game_round_id", type: "uuid", nullable: true })
  gameRoundId!: string | null;

  @Column({ name: "transaction_type", type: "varchar", length: 20 })
  transactionType!: WalletTransactionType;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: string;

  @Column({ name: "balance_before", type: "decimal", precision: 14, scale: 2 })
  balanceBefore!: string;

  @Column({ name: "balance_after", type: "decimal", precision: 14, scale: 2 })
  balanceAfter!: string;

  @Column({ type: "varchar", length: 100 })
  reference!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
