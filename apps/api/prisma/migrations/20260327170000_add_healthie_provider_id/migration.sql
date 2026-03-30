ALTER TABLE "User"
ADD COLUMN "healthieProviderId" TEXT;

CREATE UNIQUE INDEX "User_healthieProviderId_key"
ON "User"("healthieProviderId");
