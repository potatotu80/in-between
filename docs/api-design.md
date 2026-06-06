# API Design

## API principles

- JSON over HTTPS
- JWT bearer auth for MVP
- versioned under `/api/v1`
- wallet-facing payloads designed to map later to third-party wallet providers
- iframe-safe auth/session expansion can be added later with signed launch tokens

## Authentication

### `POST /api/v1/auth/login`

Authenticates a player or admin.

Request:

```json
{
  "username": "player1",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "user": {
    "id": "uuid",
    "username": "player1",
    "displayName": "Player One",
    "role": "player",
    "locale": "en"
  }
}
```

### `GET /api/v1/auth/profile`

Returns the current authenticated user and wallet summary.

## Lobby

### `GET /api/v1/lobby`

Returns lobby metadata, supported bet limits, currency, and player balance.

## Games

### `POST /api/v1/games/sessions`

Starts a new game session.

### `POST /api/v1/games/sessions/:sessionId/rounds`

Creates a new round and deals the two boundary cards.

### `POST /api/v1/games/sessions/:sessionId/rounds/:roundId/settle`

Accepts a bet amount, draws the third card, resolves the round, and returns wallet settlement details.

Request:

```json
{
  "betAmount": 20
}
```

Response:

```json
{
  "roundId": "uuid",
  "outcome": "win",
  "betAmount": 20,
  "payoutAmount": 20,
  "balance": 120,
  "cards": {
    "left": { "rank": 3, "suit": "hearts" },
    "right": { "rank": 11, "suit": "spades" },
    "drawn": { "rank": 8, "suit": "clubs" }
  }
}
```

### `GET /api/v1/games/history`

Returns paginated round history for the authenticated user.

## Wallet

### `GET /api/v1/wallet`

Returns current balance and locked balance.

### `GET /api/v1/wallet/transactions`

Returns wallet transaction history.

## Admin

### `GET /api/v1/admin/overview`

High-level dashboard metrics:

- total users
- active sessions
- rounds today
- turnover
- gross gaming revenue

### `GET /api/v1/admin/rounds`

Paginated round listing for monitoring and support.

### `GET /api/v1/admin/users`

Paginated player listing with wallet summary.

## Error format

```json
{
  "statusCode": 400,
  "message": "Insufficient balance",
  "error": "Bad Request"
}
```
