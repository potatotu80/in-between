export type LoginResponse = {
  accessToken: string;
  user: {
    sub: string;
    username: string;
    displayName: string;
    role: "player" | "admin";
    locale: string;
  };
};

export type AdminOverview = {
  totalUsers: number;
  activeSessions: number;
  totalRounds: number;
  settledRounds: number;
  turnover: number;
  grossGamingRevenue: number;
};

export type AdminUser = {
  id: string;
  username: string;
  displayName: string;
  locale: string;
  wallet: {
    balance: number;
    currency: string;
  };
};

export type AdminRound = {
  id: string;
  roundNumber: number;
  userId: string;
  status: string;
  betAmount: number;
  outcome: string;
  payoutAmount: number;
  leftCard: {
    rank: number;
    suit: string;
  };
  rightCard: {
    rank: number;
    suit: string;
  };
  drawnCard: {
    rank: number;
    suit: string;
  } | null;
  createdAt: string;
  settledAt: string | null;
  reason: string;
};
