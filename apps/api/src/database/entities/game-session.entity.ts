import { GameSessionStatus } from "@in-between/shared";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "game_sessions" })
export class GameSessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 20 })
  status!: GameSessionStatus;

  @Column({ name: "started_at", type: "timestamptz" })
  startedAt!: Date;

  @Column({ name: "ended_at", type: "timestamptz", nullable: true })
  endedAt!: Date | null;

  @Column({ name: "client_platform", type: "varchar", length: 30, default: "mobile_web" })
  clientPlatform!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
