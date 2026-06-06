import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: "In Between API",
      ok: true,
      docsHint: "Use the frontend at http://localhost:3000 and API routes under /api/v1",
      endpoints: {
        health: "/api/v1/health",
        login: "/api/v1/auth/login",
        lobby: "/api/v1/lobby",
      },
    };
  }
}
