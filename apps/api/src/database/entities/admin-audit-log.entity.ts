import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "admin_audit_logs" })
export class AdminAuditLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "admin_user_id", type: "uuid" })
  adminUserId!: string;

  @Column({ type: "varchar", length: 100 })
  action!: string;

  @Column({ name: "target_type", type: "varchar", length: 50 })
  targetType!: string;

  @Column({ name: "target_id", type: "uuid", nullable: true })
  targetId!: string | null;

  @Column({ type: "jsonb", nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
