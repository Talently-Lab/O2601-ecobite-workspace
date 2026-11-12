-- AlterTable
ALTER TABLE "surpluses" ADD COLUMN     "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];
