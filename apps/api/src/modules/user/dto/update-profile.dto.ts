import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: "Full name must be between 2 and 100 characters" })
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: "Full name can only contain letters, spaces, and hyphens",
  })
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s()-]{7,20}$/, {
    message: "Must be a valid phone number",
  })
  phone?: string;

  @IsOptional()
  @IsDateString({}, { message: "Must be a valid date" })
  dateOfBirth?: string;

  @IsOptional()
  @IsNumber({}, { message: "Weight must be a number" })
  weight?: number | null;

  @IsOptional()
  @IsIn(["kg", "lbs"], { message: "Weight unit must be kg or lbs" })
  weightUnit?: string;

  @IsOptional()
  @IsNumber({}, { message: "Height must be a number" })
  height?: number | null;

  @IsOptional()
  @IsIn(["ft", "cm"], { message: "Height unit must be ft or cm" })
  heightUnit?: string;
}
