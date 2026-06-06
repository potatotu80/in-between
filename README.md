# In Between

Commercial web-based card gaming platform for the Chinese New Year card game "In Between" (`射龙门`).

## MVP stack

- Frontend: Next.js, React, Tailwind CSS, Phaser.js
- Backend: NestJS, PostgreSQL, Redis
- Platform goals: mobile-friendly, iframe embeddable, wallet API ready, multilingual, admin-enabled, scalable

## Repo layout

- `apps/api`: NestJS backend for gameplay, auth, wallet, history, and admin APIs
- `apps/web`: reserved for the Next.js player client
- `apps/admin`: reserved for the admin panel
- `packages/shared`: shared types and constants
- `docs`: architecture, schema, API, and implementation planning

## Backend-first MVP

This repository currently focuses on Phase 1 backend scaffolding:

- authentication and roles
- lobby and game session APIs
- simulated wallet balance and settlements
- game history endpoints
- admin reporting endpoints
- standard In Between rules engine

## Current backend status

- NestJS API scaffolded
- PostgreSQL entities and initial migration added
- default seed bootstrap for `player1` and `admin1`
- game sessions, rounds, wallet transactions, and history now use repository-backed persistence

## Key documents

- [Folder structure](./docs/folder-structure.md)
- [Database schema](./docs/database-schema.md)
- [API design](./docs/api-design.md)
- [Implementation plan](./docs/implementation-plan.md)
