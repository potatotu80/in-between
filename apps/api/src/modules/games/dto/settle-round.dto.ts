import { IsNumber, Max, Min } from "class-validator";

export class SettleRoundDto {
  @IsNumber()
  @Min(10)
  @Max(500)
  betAmount!: number;
}
