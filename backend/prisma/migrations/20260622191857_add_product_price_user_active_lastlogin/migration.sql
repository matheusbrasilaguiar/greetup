-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "price" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3);
