-- AlterTable: adiciona campos nota e createdAt ao FeedbackUser
-- Execute: npx prisma migrate deploy

ALTER TABLE "FeedbackUser" ADD COLUMN "nota" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "FeedbackUser" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
