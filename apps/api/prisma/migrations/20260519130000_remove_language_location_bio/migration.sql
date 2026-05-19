-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "location",
DROP COLUMN IF EXISTS "bio";

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN IF EXISTS "language";
