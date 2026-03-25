import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { AuthUser } from "@sniffles/types";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ACCESS_TOKEN_COOKIE } from "../../../shared/cookie.utils";

function extractCookieFromHeader(
  cookieHeader: string | undefined,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token =
      (request.cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined) ??
      extractCookieFromHeader(
        request.headers.cookie as string | undefined,
        ACCESS_TOKEN_COOKIE,
      );

    if (!token) {
      throw new UnauthorizedException("Missing authentication cookie");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        fullName: null,
        emailVerified: true,
        phone: null,
        dateOfBirth: null,
        weight: null,
        weightUnit: null,
        height: null,
        heightUnit: null,
        avatarUrl: null,
      };

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
