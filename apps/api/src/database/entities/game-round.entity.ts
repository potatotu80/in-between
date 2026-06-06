import { GameOutcome, GameRoundStatus } from "@in-between/shared";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "game_rounds" })
export class GameRoundEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "session_id", type: "uuid" })
  sessionId!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "round_number", type: "int" })
  roundNumber!: number;

  @Column({ type: "varchar", length: 20 })
  status!: GameRoundStatus;

  @Column({ name: "bet_amount", type: "decimal", precision: 14, scale: 2 })
  betAmount!: string;

  @Column({ name: "left_card_rank", type: "int" })
  leftCardRank!: number;

  @Column({ name: "left_card_suit", type: "varchar", length: 10 })
  leftCardSuit!: string;

  @Column({ name: "right_card_rank", type: "int" })
  rightCardRank!: number;

  @Column({ name: "right_card_suit", type: "varchar", length: 10 })
  rightCardSuit!: string;

  @Column({ name: "drawn_card_rank", type: "int", nullable: true })
  drawnCardRank!: number | null;

  @Column({ name: "drawn_card_suit", type: "varchar", length: 10, nullable: true })
  drawnCardSuit!: string | null;

  @Column({ name: "deck_state", type: "jsonb", nullable: true })
  deckState!: Array<{ rank: number; suit: string }> | null;

  @Column({ type: "varchar", length: 20 })
  outcome!: GameOutcome;

  @Column({ name: "resolution_reason", type: "varchar", length: 255, default: "" })
  resolutionReason!: string;

  @Column({ name: "payout_multiplier", type: "decimal", precision: 6, scale: 2 })
  payoutMultiplier!: string;

  @Column({ name: "payout_amount", type: "decimal", precision: 14, scale: 2 })
  payoutAmount!: string;

  @Column({ name: "settled_at", type: "timestamptz", nullable: true })
  settledAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
