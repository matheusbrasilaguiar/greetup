-- AlterEnum
ALTER TYPE "ProductCategory" ADD VALUE 'MASSA';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "toGo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "courtesy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "withCheese" BOOLEAN;
