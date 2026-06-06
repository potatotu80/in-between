import { Injectable } from "@nestjs/common";

@Injectable()
export class LobbyService {
  getLobbyState() {
    return {
      gameCode: "in-between",
      tableName: "MVP Main Table",
      currency: "CNY",
      betLimits: {
        min: 10,
        max: 500,
        defaults: [10, 20, 50, 100, 200],
      },
      supportedLocales: ["en", "zh"],
      embed: {
        iframeReady: true,
        walletIntegrationReady: true,
      },
    };
  }
}
