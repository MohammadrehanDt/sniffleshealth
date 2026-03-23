import { IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString({ message: "refreshToken is required" })
  refreshToken!: string;
}
