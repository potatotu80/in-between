import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.type";
import { GamesService } from "../games/games.service";

@UseGuards(JwtAuthGuard)
@Controller("history")
export class HistoryController {
  constructor(private readonly gamesService: GamesService) {}

  @Get("rounds")
  getRoundHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.gamesService.getHistoryForUser(user.sub);
  }
}
