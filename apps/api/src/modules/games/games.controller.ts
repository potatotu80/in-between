import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.type";
import { CreateSessionDto } from "./dto/create-session.dto";
import { SettleRoundDto } from "./dto/settle-round.dto";
import { GamesService } from "./games.service";

@UseGuards(JwtAuthGuard)
@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post("sessions")
  createSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateSessionDto,
  ) {
    return this.gamesService.createSession(user.sub, body.clientPlatform);
  }

  @Post("sessions/:sessionId/rounds")
  createRound(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId") sessionId: string,
  ) {
    return this.gamesService.createRound(user.sub, sessionId);
  }

  @Post("sessions/:sessionId/rounds/:roundId/settle")
  settleRound(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId") sessionId: string,
    @Param("roundId") roundId: string,
    @Body() body: SettleRoundDto,
  ) {
    return this.gamesService.settleRound(user.sub, sessionId, roundId, body.betAmount);
  }

  @Get("history")
  getHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.gamesService.getHistoryForUser(user.sub);
  }
}
