import { randomUUID } from "crypto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  CardSuit,
  GameOutcome,
  GameRoundStatus,
  GameSessionStatus,
  WalletTransactionType,
} from "@in-between/shared";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GameRoundEntity } from "../../database/entities/game-round.entity";
import { GameSessionEntity } from "../../database/entities/game-session.entity";
import { LobbyService } from "../lobby/lobby.service";
import { WalletsService } from "../wallets/wallets.service";
import { GameEngineService } from "./game-engine.service";

type Card = {
  rank: number;
  suit: CardSuit;
};

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameSessionEntity)
    private readonly sessionsRepository: Repository<GameSessionEntity>,
    @InjectRepository(GameRoundEntity)
    private readonly roundsRepository: Repository<GameRoundEntity>,
    private readonly gameEngineService: GameEngineService,
    private readonly walletsService: WalletsService,
    private readonly lobbyService: LobbyService,
  ) {}

  async createSession(userId: string, clientPlatform = "mobile_web") {
    const session = this.sessionsRepository.create({
      id: randomUUID(),
      userId,
      status: GameSessionStatus.ACTIVE,
      startedAt: new Date(),
      endedAt: null,
      clientPlatform,
    });

    const savedSession = await this.sessionsRepository.save(session);
    return this.toSessionResponse(savedSession);
  }

  async createRound(userId: string, sessionId: string) {
    const session = await this.findUserSession(userId, sessionId);
    const { left, right, deck } = this.gameEngineService.dealBoundaryCards();
    const existingRounds = await this.roundsRepository.count({
      where: { sessionId: session.id },
    });

    const round = this.roundsRepository.create({
      id: randomUUID(),
      sessionId: session.id,
      userId,
      roundNumber: existingRounds + 1,
      status: GameRoundStatus.PENDING_BET,
      betAmount: "0.00",
      leftCardRank: left.rank,
      leftCardSuit: left.suit,
      rightCardRank: right.rank,
      rightCardSuit: right.suit,
      drawnCardRank: null,
      drawnCardSuit: null,
      deckState: deck,
      outcome: GameOutcome.VOID,
      resolutionReason: "Awaiting settlement",
      payoutMultiplier: "0.00",
      payoutAmount: "0.00",
      settledAt: null,
    });

    const savedRound = await this.roundsRepository.save(round);
    return this.toRoundResponse(savedRound);
  }

  async settleRound(userId: string, sessionId: string, roundId: string, betAmount: number) {
    const limits = this.lobbyService.getLobbyState().betLimits;

    if (betAmount < limits.min || betAmount > limits.max) {
      throw new BadRequestException("Bet amount is outside the supported limits");
    }

    const session = await this.findUserSession(userId, sessionId);
    const round = await this.roundsRepository.findOne({
      where: {
        id: roundId,
        sessionId: session.id,
        userId,
      },
    });

    if (!round) {
      throw new NotFoundException("Round not found");
    }

    if (round.status !== GameRoundStatus.PENDING_BET) {
      throw new BadRequestException("Round is already settled");
    }

    const deck = (round.deckState ?? []) as Card[];
    const drawnCard = this.gameEngineService.drawCard(deck);
    const leftCard = {
      rank: round.leftCardRank,
      suit: round.leftCardSuit as CardSuit,
    };
    const rightCard = {
      rank: round.rightCardRank,
      suit: round.rightCardSuit as CardSuit,
    };
    const resolution = this.gameEngineService.resolveRound(leftCard, rightCard, drawnCard);
    const payoutAmount =
      resolution.outcome === GameOutcome.WIN
        ? Number((betAmount * resolution.payoutMultiplier).toFixed(2))
        : 0;

    round.betAmount = betAmount.toFixed(2);
    round.drawnCardRank = drawnCard.rank;
    round.drawnCardSuit = drawnCard.suit;
    round.outcome = resolution.outcome;
    round.payoutMultiplier = resolution.payoutMultiplier.toFixed(2);
    round.resolutionReason = resolution.reason;
    round.status =
      resolution.outcome === GameOutcome.VOID
        ? GameRoundStatus.VOID
        : GameRoundStatus.SETTLED;
    round.payoutAmount = payoutAmount.toFixed(2);
    round.settledAt = new Date();
    round.deckState = deck;

    const savedRound = await this.roundsRepository.save(round);

    const amountDelta =
      resolution.outcome === GameOutcome.WIN
        ? payoutAmount
        : resolution.outcome === GameOutcome.LOSE
          ? -betAmount
          : 0;

    const settlement = await this.walletsService.applySettlement({
      userId,
      amountDelta,
      gameRoundId: savedRound.id,
      transactionType:
        amountDelta >= 0
          ? WalletTransactionType.SETTLEMENT
          : WalletTransactionType.DEBIT,
      reference: `round:${savedRound.id}`,
      metadata: {
        outcome: savedRound.outcome,
        betAmount,
      },
    });

    return {
      ...this.toRoundResponse(savedRound),
      balance: settlement.wallet.balance,
      transaction: settlement.transaction,
    };
  }

  async getHistoryForUser(userId: string) {
    const rounds = await this.roundsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });

    return rounds.map((round) => this.toRoundResponse(round));
  }

  async getAdminOverview() {
    const [totalUsers, activeSessions, totalRounds, settledRounds, settledRoundRows] =
      await Promise.all([
        this.sessionsRepository.manager.count("users"),
        this.sessionsRepository.count({
          where: { status: GameSessionStatus.ACTIVE },
        }),
        this.roundsRepository.count(),
        this.roundsRepository.count({
          where: [
            { status: GameRoundStatus.SETTLED },
            { status: GameRoundStatus.VOID },
          ],
        }),
        this.roundsRepository.find({
          where: [
            { status: GameRoundStatus.SETTLED },
            { status: GameRoundStatus.VOID },
          ],
        }),
      ]);

    const turnover = settledRoundRows.reduce(
      (sum, round) => sum + Number(round.betAmount),
      0,
    );
    const payouts = settledRoundRows.reduce(
      (sum, round) => sum + Number(round.payoutAmount),
      0,
    );

    return {
      totalUsers,
      activeSessions,
      totalRounds,
      settledRounds,
      turnover,
      grossGamingRevenue: Number((turnover - payouts).toFixed(2)),
    };
  }

  async getAllRounds() {
    const rounds = await this.roundsRepository.find({
      order: { createdAt: "DESC" },
    });

    return rounds.map((round) => this.toRoundResponse(round));
  }

  async getAllSessions() {
    const sessions = await this.sessionsRepository.find({
      order: { createdAt: "DESC" },
    });

    return sessions.map((session) => this.toSessionResponse(session));
  }

  private async findUserSession(userId: string, sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    return session;
  }

  private toSessionResponse(session: GameSessionEntity) {
    return {
      id: session.id,
      userId: session.userId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      clientPlatform: session.clientPlatform,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private toRoundResponse(round: GameRoundEntity) {
    return {
      id: round.id,
      sessionId: round.sessionId,
      userId: round.userId,
      roundNumber: round.roundNumber,
      status: round.status,
      betAmount: Number(round.betAmount),
      leftCard: {
        rank: round.leftCardRank,
        suit: round.leftCardSuit,
      },
      rightCard: {
        rank: round.rightCardRank,
        suit: round.rightCardSuit,
      },
      drawnCard:
        round.drawnCardRank && round.drawnCardSuit
          ? {
              rank: round.drawnCardRank,
              suit: round.drawnCardSuit,
            }
          : null,
      outcome: round.outcome,
      payoutMultiplier: Number(round.payoutMultiplier),
      payoutAmount: Number(round.payoutAmount),
      reason: round.resolutionReason,
      createdAt: round.createdAt,
      settledAt: round.settledAt,
    };
  }
}
