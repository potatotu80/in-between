import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user || user.passwordHash !== `demo:${password}`) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      locale: user.locale,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      locale: user.locale,
      status: user.status,
    };
  }
}
