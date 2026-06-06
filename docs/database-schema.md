# Database Schema

## MVP schema goals

- support real users and admin roles
- support one wallet per user for simulated balance
- support traceable game rounds and settlements
- support history views and admin reporting
- leave room for later platform wallet integrations

## Main tables

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `username` | varchar(50) | unique login name |
| `display_name` | varchar(100) | player-facing name |
| `password_hash` | varchar(255) | bcrypt/argon hash |
| `role` | varchar(20) | `player` or `admin` |
| `status` | varchar(20) | `active`, `suspended`, `disabled` |
| `locale` | varchar(10) | `en` or `zh` |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | default now |

### `wallets`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `user_id` | uuid | unique FK to `users.id` |
| `currency` | varchar(10) | MVP default `CNY` |
| `balance` | numeric(14,2) | simulated main balance |
| `locked_balance` | numeric(14,2) | reserved for in-flight bets |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | default now |

### `wallet_transactions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `wallet_id` | uuid | FK to `wallets.id` |
| `game_round_id` | uuid | nullable FK |
| `transaction_type` | varchar(20) | `credit`, `debit`, `hold`, `release`, `settlement` |
| `amount` | numeric(14,2) | positive decimal |
| `balance_before` | numeric(14,2) | audit trail |
| `balance_after` | numeric(14,2) | audit trail |
| `reference` | varchar(100) | integration-safe external reference |
| `metadata` | jsonb | wallet/provider details |
| `created_at` | timestamptz | default now |

### `game_sessions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `user_id` | uuid | FK to `users.id` |
| `status` | varchar(20) | `active`, `completed`, `closed` |
| `started_at` | timestamptz | default now |
| `ended_at` | timestamptz | nullable |
| `client_platform` | varchar(30) | `mobile_web`, `desktop_web`, `iframe` |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | default now |

### `game_rounds`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `session_id` | uuid | FK to `game_sessions.id` |
| `user_id` | uuid | FK to `users.id` |
| `round_number` | int | sequential per session |
| `status` | varchar(20) | `pending_bet`, `settled`, `void` |
| `bet_amount` | numeric(14,2) | player stake |
| `left_card_rank` | int | 1-13 |
| `left_card_suit` | varchar(10) | `hearts`, etc. |
| `right_card_rank` | int | 1-13 |
| `right_card_suit` | varchar(10) | `hearts`, etc. |
| `drawn_card_rank` | int | nullable until settle |
| `drawn_card_suit` | varchar(10) | nullable until settle |
| `outcome` | varchar(20) | `win`, `lose`, `void` |
| `payout_multiplier` | numeric(6,2) | MVP default `1.00` |
| `payout_amount` | numeric(14,2) | net payout excluding original bet return |
| `settled_at` | timestamptz | nullable |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | default now |

### `admin_audit_logs`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key |
| `admin_user_id` | uuid | FK to `users.id` |
| `action` | varchar(100) | admin action identifier |
| `target_type` | varchar(50) | `user`, `wallet`, `game_round`, etc. |
| `target_id` | uuid | nullable |
| `metadata` | jsonb | action context |
| `created_at` | timestamptz | default now |

## Core indexes

- unique index on `users.username`
- unique index on `wallets.user_id`
- index on `game_sessions.user_id`
- composite index on `game_rounds(user_id, created_at desc)`
- composite index on `game_rounds(session_id, round_number)`
- index on `wallet_transactions(wallet_id, created_at desc)`

## MVP rule assumptions

Phase 1 uses a standard in-between flow:

- two boundary cards are dealt first
- if both cards have the same rank, the round is void and a new round should be started
- if the boundary cards are adjacent, the player loses because there is no value strictly between them
- otherwise, the third card wins only if its rank is strictly between the two boundary ranks
- matching either boundary rank is treated as a loss in MVP

These rules should be made configurable in Phase 2 because house rules vary by operator.

## Example SQL

```sql
create table users (
  id uuid primary key,
  username varchar(50) unique not null,
  display_name varchar(100) not null,
  password_hash varchar(255) not null,
  role varchar(20) not null,
  status varchar(20) not null,
  locale varchar(10) not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
