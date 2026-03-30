-- CreateEnum
CREATE TYPE "DoctorVerificationStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LicenseAuditAction" AS ENUM ('SUBMITTED', 'VERIFIED', 'REJECTED', 'RENEWAL_SUBMITTED', 'EXPIRED_AUTO', 'REMINDER_60_DAYS', 'REMINDER_30_DAYS');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "verificationStatus" "DoctorVerificationStatus",
ADD COLUMN "verificationNote" TEXT,
ADD COLUMN "verifiedAt" TIMESTAMP(3);

-- Set existing doctors as verified
UPDATE "User" SET "verificationStatus" = 'VERIFIED', "verifiedAt" = NOW()
WHERE "role" = 'DOCTOR';

-- CreateTable
CREATE TABLE "StateLicense" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "obtainedDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "status" "LicenseStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejectionReason" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByAdminId" TEXT,
    "reminder60Sent" BOOLEAN NOT NULL DEFAULT false,
    "reminder30Sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StateLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseAuditLog" (
    "id" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "action" "LicenseAuditAction" NOT NULL,
    "performedById" TEXT,
    "note" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LicenseAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StateLicense_doctorId_stateCode_key" ON "StateLicense"("doctorId", "stateCode");

-- CreateIndex
CREATE INDEX "StateLicense_doctorId_idx" ON "StateLicense"("doctorId");

-- CreateIndex
CREATE INDEX "StateLicense_status_idx" ON "StateLicense"("status");

-- CreateIndex
CREATE INDEX "StateLicense_expiryDate_idx" ON "StateLicense"("expiryDate");

-- CreateIndex
CREATE INDEX "LicenseAuditLog_licenseId_idx" ON "LicenseAuditLog"("licenseId");

-- CreateIndex
CREATE INDEX "LicenseAuditLog_createdAt_idx" ON "LicenseAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "StateLicense" ADD CONSTRAINT "StateLicense_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateLicense" ADD CONSTRAINT "StateLicense_verifiedByAdminId_fkey" FOREIGN KEY ("verifiedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseAuditLog" ADD CONSTRAINT "LicenseAuditLog_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "StateLicense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
