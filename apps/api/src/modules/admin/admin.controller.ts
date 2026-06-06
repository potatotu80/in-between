import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserRole } from "@in-between/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.type";
import { GamesService } from "../games/games.service";
import { UsersService } from "../users/users.service";
import { WalletsService } from "../wallets/wallets.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
  ) {}

  @Get("overview")
  getOverview(@CurrentUser() _user: AuthenticatedUser) {
    return this.gamesService.getAdminOverview();
  }

  @Get("users")
  async getUsers() {
    const users = await this.usersService.listPlayers();
    return Promise.all(users.map(async (user) => ({
      ...user,
      wallet: await this.walletsService.getWalletByUserId(user.id),
    })));
  }

  @Get("rounds")
  getRounds() {
    return this.gamesService.getAllRounds();
  }
}
