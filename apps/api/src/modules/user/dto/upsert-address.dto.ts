import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class UpsertAddressDto {
  @IsString()
  @Length(1, 50, { message: "Label must be between 1 and 50 characters" })
  label!: string;

  @IsString()
  @Length(1, 200, {
    message: "Address line 1 must be between 1 and 200 characters",
  })
  addressLine1!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200, { message: "Address line 2 must be under 200 characters" })
  addressLine2?: string;

  @IsString()
  @Length(2, 2, { message: "State must be a 2-letter code" })
  @Matches(/^[A-Z]{2}$/, { message: "State must be a valid US state code" })
  state!: string;

  @IsString()
  @Length(1, 100, { message: "City must be between 1 and 100 characters" })
  city!: string;

  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, { message: "Must be a valid US ZIP code" })
  zipCode!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
