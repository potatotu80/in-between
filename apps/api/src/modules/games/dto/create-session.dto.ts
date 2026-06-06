import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  @IsIn(["mobile_web", "desktop_web", "iframe"])
  clientPlatform?: string;
}
