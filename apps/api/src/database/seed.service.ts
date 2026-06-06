import { randomUUID } from "crypto";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { UserRole, UserStatus } from "@in-between/shared";
import { WalletsService } from "../modules/wallets/wallets.service";
import { UsersService } from "../modules/users/users.service";

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
  ) {}

  async onApplicationBootstrap() {
    const userCount = await this.usersService.countAll();

    if (userCount > 0) {
      return;
    }

    this.logger.log("Seeding default MVP users and wallets");

    const player = await this.usersService.create({
      id: randomUUID(),
      username: "player1",
      displayName: "Player One",
      passwordHash: "demo:password123",
      role: UserRole.PLAYER,
      status: UserStatus.ACTIVE,
      locale: "en",
    });

    const admin = await this.usersService.create({
      id: randomUUID(),
      username: "admin1",
      displayName: "Admin One",
      passwordHash: "demo:admin123",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      locale: "en",
    });

    await this.walletsService.createWallet({
      id: randomUUID(),
      userId: player.id,
      currency: "CNY",
      balance: 1000,
      lockedBalance: 0,
    });

    await this.walletsService.createWallet({
      id: randomUUID(),
      userId: admin.id,
      currency: "CNY",
      balance: 0,
      lockedBalance: 0,
    });
  }
}
