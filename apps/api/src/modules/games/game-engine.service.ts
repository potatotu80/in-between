import { Injectable } from "@nestjs/common";
import { CardSuit, GameOutcome, RoundResolution } from "@in-between/shared";

type Card = {
  rank: number;
  suit: CardSuit;
};

@Injectable()
export class GameEngineService {
  private readonly suits = [
    CardSuit.HEARTS,
    CardSuit.DIAMONDS,
    CardSuit.CLUBS,
    CardSuit.SPADES,
  ];

  createDeck(): Card[] {
    const deck: Card[] = [];

    for (const suit of this.suits) {
      for (let rank = 1; rank <= 13; rank += 1) {
        deck.push({ rank, suit });
      }
    }

    return this.shuffle(deck);
  }

  dealBoundaryCards() {
    const deck = this.createDeck();
    const left = deck.pop() as Card;
    const right = deck.pop() as Card;

    return {
      left,
      right,
      deck,
    };
  }

  drawCard(deck: Card[]) {
    return deck.pop() as Card;
  }

  resolveRound(left: Card, right: Card, drawn: Card): RoundResolution {
    const minRank = Math.min(left.rank, right.rank);
    const maxRank = Math.max(left.rank, right.rank);

    if (left.rank === right.rank) {
      return {
        outcome: GameOutcome.VOID,
        payoutMultiplier: 0,
        reason: "Matching boundary cards void the round in MVP rules",
      };
    }

    if (maxRank - minRank === 1) {
      return {
        outcome: GameOutcome.LOSE,
        payoutMultiplier: 0,
        reason: "Adjacent boundary cards leave no in-between value",
      };
    }

    if (drawn.rank > minRank && drawn.rank < maxRank) {
      return {
        outcome: GameOutcome.WIN,
        payoutMultiplier: 1,
        reason: "Drawn card landed strictly between the boundary cards",
      };
    }

    return {
      outcome: GameOutcome.LOSE,
      payoutMultiplier: 0,
      reason: "Drawn card was outside or matching a boundary card",
    };
  }

  private shuffle<T>(items: T[]): T[] {
    const array = [...items];

    for (let index = array.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }

    return array;
  }
}
