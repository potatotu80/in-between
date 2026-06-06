import { UserRole, UserStatus } from "@in-between/shared";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ name: "display_name", length: 100 })
  displayName!: string;

  @Column({ name: "password_hash", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 20 })
  role!: UserRole;

  @Column({ type: "varchar", length: 20 })
  status!: UserStatus;

  @Column({ type: "varchar", length: 10, default: "en" })
  locale!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
