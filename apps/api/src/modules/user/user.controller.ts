import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Inject,
} from "@nestjs/common";
import type { AuthUser } from "@sniffles/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpsertAddressDto } from "./dto/upsert-address.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  @Inject(UserService)
  private readonly userService!: UserService;

  @Patch("profile")
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.id, dto);
  }

  @Patch("profile/avatar")
  async updateAvatar(
    @CurrentUser() user: AuthUser,
    @Body("avatarUrl") avatarUrl: string,
  ) {
    return this.userService.updateAvatar(user.id, avatarUrl);
  }

  @Get("addresses")
  async getAddresses(@CurrentUser() user: AuthUser) {
    return this.userService.getAddresses(user.id);
  }

  @Post("addresses")
  async createAddress(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertAddressDto,
  ) {
    return this.userService.createAddress(user.id, dto);
  }

  @Patch("addresses/:id")
  async updateAddress(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: UpsertAddressDto,
  ) {
    return this.userService.updateAddress(user.id, id, dto);
  }

  @Delete("addresses/:id")
  async deleteAddress(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.userService.deleteAddress(user.id, id);
  }
}
