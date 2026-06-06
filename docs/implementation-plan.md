# Implementation Plan

## Phase 1 MVP sequence

1. Establish the monorepo structure and backend service boundaries.
2. Scaffold the NestJS API with config, auth, game, wallet, history, and admin modules.
3. Add PostgreSQL entities, migrations, and repository patterns.
4. Implement the In Between rules engine and round settlement flow.
5. Add JWT auth, role guards, and secure request validation.
6. Add Redis-backed caching and session-friendly utilities.
7. Expose history, wallet, and admin reporting endpoints.
8. Scaffold the Next.js player client and mobile-first lobby/game shell.
9. Add multilingual dictionaries for English and Chinese.
10. Prepare iframe embedding and external wallet integration hooks.

## Phase 1 delivery scope

- user login
- lobby page API contract
- game session start
- standard in-between settlement logic
- simulated wallet balance
- bet amount processing
- win/lose settlement
- game history
- admin reporting endpoints

## Immediate backend milestones

1. Base NestJS bootstrap
2. Domain models and DTOs
3. Rules engine service
4. Game orchestration service
5. Wallet settlement service
6. Auth and admin guards
7. Database wiring

## Important assumptions

- MVP uses simulated balance instead of external wallet APIs
- MVP uses JWT login instead of operator SSO launch tokens
- MVP uses one active wallet currency
- exact operator-specific house rules can be parameterized later

## Recommended next step after scaffold

Install dependencies, start PostgreSQL and Redis, run migrations, and then bring up the API locally for end-to-end testing.
