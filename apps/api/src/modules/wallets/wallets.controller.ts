import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.type";
import { WalletsService } from "./wallets.service";

@UseGuards(JwtAuthGuard)
@Controller("wallet")
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  getWallet(@CurrentUser() user: AuthenticatedUser) {
    return this.walletsService.getWalletByUserId(user.sub);
  }

  @Get("transactions")
  getTransactions(@CurrentUser() user: AuthenticatedUser) {
    return this.walletsService.listTransactionsByUserId(user.sub);
  }
}
