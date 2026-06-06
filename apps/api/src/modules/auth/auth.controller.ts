import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.type";
import { WalletsService } from "../wallets/wallets.service";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly walletsService: WalletsService,
  ) {}

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async profile(@CurrentUser() user: AuthenticatedUser) {
    return {
      user: await this.authService.getProfile(user.sub),
      wallet: await this.walletsService.getWalletByUserId(user.sub),
    };
  }
}
