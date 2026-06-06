# Folder Structure

## Target structure

```text
in-between/
├─ apps/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ common/
│  │  │  ├─ config/
│  │  │  ├─ modules/
│  │  │  │  ├─ admin/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ games/
│  │  │  │  ├─ history/
│  │  │  │  ├─ lobby/
│  │  │  │  ├─ users/
│  │  │  │  └─ wallets/
│  │  │  ├─ database/
│  │  │  │  ├─ entities/
│  │  │  │  └─ migrations/
│  │  │  └─ main.ts
│  │  ├─ test/
│  │  ├─ package.json
│  │  ├─ nest-cli.json
│  │  ├─ tsconfig.build.json
│  │  └─ tsconfig.json
│  ├─ web/
│  │  └─ README.md
│  └─ admin/
│     └─ README.md
├─ packages/
│  └─ shared/
│     ├─ src/
│     │  ├─ enums/
│     │  ├─ game/
│     │  └─ index.ts
│     └─ package.json
├─ docs/
│  ├─ api-design.md
│  ├─ database-schema.md
│  ├─ folder-structure.md
│  └─ implementation-plan.md
├─ .env.example
├─ docker-compose.yml
├─ package.json
└─ tsconfig.base.json
```

## Why this shape

- `apps/api` isolates the backend MVP and keeps framework concerns local.
- `apps/web` and `apps/admin` are reserved so frontend work can start later without restructuring.
- `packages/shared` is where game enums, DTO-compatible contracts, and reusable types can live once both frontend and backend are active.
- `docs` keeps the MVP decisions explicit, which matters for a commercial product with multiple future integrations.
