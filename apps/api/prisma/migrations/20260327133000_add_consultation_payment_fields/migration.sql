ALTER TABLE "Consultation"
ADD COLUMN "healthieRequestedPaymentId" TEXT,
ADD COLUMN "paymentStatus" TEXT,
ADD COLUMN "paymentAmount" TEXT;

CREATE UNIQUE INDEX "Consultation_healthieRequestedPaymentId_key"
ON "Consultation"("healthieRequestedPaymentId");
