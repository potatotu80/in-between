export type AuthUser = {
  sub: string;
  username: string;
  displayName: string;
  role: "player" | "admin";
  locale: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type Wallet = {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  lockedBalance: number;
};

export type LobbyResponse = {
  gameCode: string;
  tableName: string;
  currency: string;
  betLimits: {
    min: number;
    max: number;
    defaults: number[];
  };
  supportedLocales: string[];
  embed: {
    iframeReady: boolean;
    walletIntegrationReady: boolean;
  };
  wallet: Wallet;
};

export type GameSession = {
  id: string;
  userId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  clientPlatform: string;
};

export type Card = {
  rank: number;
  suit: string;
};

export type GameRound = {
  id: string;
  sessionId: string;
  userId: string;
  roundNumber: number;
  status: string;
  betAmount: number;
  leftCard: Card;
  rightCard: Card;
  drawnCard: Card | null;
  outcome: string;
  payoutMultiplier: number;
  payoutAmount: number;
  reason: string;
  createdAt: string;
  settledAt: string | null;
};

export type SettledRound = GameRound & {
  balance: number;
  transaction: {
    id: string;
    transactionType: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: string;
  };
};
