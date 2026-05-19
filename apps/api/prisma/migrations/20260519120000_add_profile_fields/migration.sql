-- AlterTable
ALTER TABLE "User" ADD COLUMN "phone" TEXT,
ADD COLUMN "birthDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'light';
