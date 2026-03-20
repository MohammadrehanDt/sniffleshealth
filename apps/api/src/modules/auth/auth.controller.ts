import { Body, Controller, Get, Post, UseGuards, Inject } from "@nestjs/common";
import type { AuthResponse, AuthUser } from "@sniffles/types";
import { CurrentUser } from "./decorators/current-user.decorator";
import { AuthService } from "./auth.service";
import { CompleteSignupDto } from "./dto/complete-signup.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RequestOtpDto } from "./dto/request-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  @Inject(AuthService)
  private readonly authService!: AuthService;

  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post("request-otp")
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Post("verify-otp")
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post("complete-signup")
  async completeSignup(@Body() dto: CompleteSignupDto): Promise<AuthResponse> {
    return this.authService.completeSignup(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.id);
  }
}
