import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "wallets" })
export class WalletEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid", unique: true })
  userId!: string;

  @Column({ type: "varchar", length: 10, default: "CNY" })
  currency!: string;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  balance!: string;

  @Column({ name: "locked_balance", type: "decimal", precision: 14, scale: 2, default: 0 })
  lockedBalance!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
