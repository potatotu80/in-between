import { CardSuit, GameOutcome } from "./enums";

export type Card = {
  rank: number;
  suit: CardSuit;
};

export type RoundResolution = {
  outcome: GameOutcome;
  payoutMultiplier: number;
  reason: string;
};
