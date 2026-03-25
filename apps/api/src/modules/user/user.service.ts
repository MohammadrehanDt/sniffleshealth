import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import type { AuthUser, ProfileAddress } from "@sniffles/types";
import { PrismaService } from "../../prisma/prisma.service";
import type { UpdateProfileDto } from "./dto/update-profile.dto";
import type { UpsertAddressDto } from "./dto/upsert-address.dto";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<AuthUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        weight: dto.weight,
        weightUnit: dto.weightUnit,
        height: dto.height,
        heightUnit: dto.heightUnit,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      emailVerified: Boolean(user.emailVerifiedAt),
      phone: user.phone,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      weight: user.weight,
      weightUnit: user.weightUnit,
      height: user.height,
      heightUnit: user.heightUnit,
      avatarUrl: user.avatarUrl,
    };
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<AuthUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      emailVerified: Boolean(user.emailVerifiedAt),
      phone: user.phone,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      weight: user.weight,
      weightUnit: user.weightUnit,
      height: user.height,
      heightUnit: user.heightUnit,
      avatarUrl: user.avatarUrl,
    };
  }

  async getAddresses(userId: string): Promise<ProfileAddress[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return addresses.map((a) => ({
      id: a.id,
      label: a.label,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2,
      state: a.state,
      city: a.city,
      zipCode: a.zipCode,
      isDefault: a.isDefault,
    }));
  }

  async createAddress(
    userId: string,
    dto: UpsertAddressDto,
  ): Promise<ProfileAddress> {
    if (dto.isDefault) {
      await this.clearDefaultAddress(userId);
    }

    const address = await this.prisma.address.create({
      data: {
        userId,
        label: dto.label,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2 ?? null,
        state: dto.state.toUpperCase(),
        city: dto.city,
        zipCode: dto.zipCode,
        isDefault: dto.isDefault ?? false,
      },
    });

    return this.toProfileAddress(address);
  }

  async updateAddress(
    userId: string,
    addressId: string,
    dto: UpsertAddressDto,
  ): Promise<ProfileAddress> {
    await this.ensureAddressOwnership(userId, addressId);

    if (dto.isDefault) {
      await this.clearDefaultAddress(userId);
    }

    const address = await this.prisma.address.update({
      where: { id: addressId },
      data: {
        label: dto.label,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2 ?? null,
        state: dto.state.toUpperCase(),
        city: dto.city,
        zipCode: dto.zipCode,
        isDefault: dto.isDefault ?? false,
      },
    });

    return this.toProfileAddress(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.ensureAddressOwnership(userId, addressId);

    await this.prisma.address.delete({ where: { id: addressId } });
  }

  private async ensureAddressOwnership(
    userId: string,
    addressId: string,
  ): Promise<void> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException("Address not found");
    }
  }

  private async clearDefaultAddress(userId: string): Promise<void> {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  private toProfileAddress(address: {
    id: string;
    label: string;
    addressLine1: string;
    addressLine2: string | null;
    state: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
  }): ProfileAddress {
    return {
      id: address.id,
      label: address.label,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      state: address.state,
      city: address.city,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    };
  }
}
