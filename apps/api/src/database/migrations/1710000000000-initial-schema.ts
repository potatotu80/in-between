import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710000000000 implements MigrationInterface {
  name = "InitialSchema1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        username varchar(50) UNIQUE NOT NULL,
        display_name varchar(100) NOT NULL,
        password_hash varchar(255) NOT NULL,
        role varchar(20) NOT NULL,
        status varchar(20) NOT NULL,
        locale varchar(10) NOT NULL DEFAULT 'en',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id uuid PRIMARY KEY,
        user_id uuid UNIQUE NOT NULL REFERENCES users(id),
        currency varchar(10) NOT NULL DEFAULT 'CNY',
        balance numeric(14,2) NOT NULL DEFAULT 0,
        locked_balance numeric(14,2) NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id uuid PRIMARY KEY,
        wallet_id uuid NOT NULL REFERENCES wallets(id),
        game_round_id uuid NULL,
        transaction_type varchar(20) NOT NULL,
        amount numeric(14,2) NOT NULL,
        balance_before numeric(14,2) NOT NULL,
        balance_after numeric(14,2) NOT NULL,
        reference varchar(100) NOT NULL,
        metadata jsonb NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id uuid PRIMARY KEY,
        user_id uuid NOT NULL REFERENCES users(id),
        status varchar(20) NOT NULL,
        started_at timestamptz NOT NULL,
        ended_at timestamptz NULL,
        client_platform varchar(30) NOT NULL DEFAULT 'mobile_web',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS game_rounds (
        id uuid PRIMARY KEY,
        session_id uuid NOT NULL REFERENCES game_sessions(id),
        user_id uuid NOT NULL REFERENCES users(id),
        round_number int NOT NULL,
        status varchar(20) NOT NULL,
        bet_amount numeric(14,2) NOT NULL DEFAULT 0,
        left_card_rank int NOT NULL,
        left_card_suit varchar(10) NOT NULL,
        right_card_rank int NOT NULL,
        right_card_suit varchar(10) NOT NULL,
        drawn_card_rank int NULL,
        drawn_card_suit varchar(10) NULL,
        deck_state jsonb NULL,
        outcome varchar(20) NOT NULL,
        resolution_reason varchar(255) NOT NULL DEFAULT '',
        payout_multiplier numeric(6,2) NOT NULL DEFAULT 0,
        payout_amount numeric(14,2) NOT NULL DEFAULT 0,
        settled_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS admin_audit_logs (
        id uuid PRIMARY KEY,
        admin_user_id uuid NOT NULL REFERENCES users(id),
        action varchar(100) NOT NULL,
        target_type varchar(50) NOT NULL,
        target_id uuid NULL,
        metadata jsonb NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_game_rounds_user_created ON game_rounds(user_id, created_at DESC);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_game_rounds_session_round ON game_rounds(session_id, round_number);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_created ON wallet_transactions(wallet_id, created_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS admin_audit_logs;`);
    await queryRunner.query(`DROP TABLE IF EXISTS game_rounds;`);
    await queryRunner.query(`DROP TABLE IF EXISTS game_sessions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS wallet_transactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS wallets;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
