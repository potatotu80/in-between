export enum UserRole {
  PLAYER = "player",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DISABLED = "disabled",
}

export enum GameSessionStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  CLOSED = "closed",
}

export enum GameRoundStatus {
  PENDING_BET = "pending_bet",
  SETTLED = "settled",
  VOID = "void",
}

export enum GameOutcome {
  WIN = "win",
  LOSE = "lose",
  VOID = "void",
}

export enum WalletTransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
  HOLD = "hold",
  RELEASE = "release",
  SETTLEMENT = "settlement",
}

export enum CardSuit {
  HEARTS = "hearts",
  DIAMONDS = "diamonds",
  CLUBS = "clubs",
  SPADES = "spades",
}
