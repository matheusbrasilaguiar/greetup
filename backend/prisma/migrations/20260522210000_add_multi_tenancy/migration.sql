-- CreateTable: Company
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- Insert a default company to hold all existing dev rows
INSERT INTO "Company" ("id", "name") VALUES ('default-company-seed', 'Default Company');

-- AlterTable: User — add companyId nullable, populate, then set NOT NULL
ALTER TABLE "User" ADD COLUMN "companyId" TEXT;
UPDATE "User" SET "companyId" = 'default-company-seed';
ALTER TABLE "User" ALTER COLUMN "companyId" SET NOT NULL;
DROP INDEX "User_email_key";

-- AlterTable: Product — add companyId
ALTER TABLE "Product" ADD COLUMN "companyId" TEXT;
UPDATE "Product" SET "companyId" = 'default-company-seed';
ALTER TABLE "Product" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable: Table — add companyId, drop old unique index on code
ALTER TABLE "Table" ADD COLUMN "companyId" TEXT;
UPDATE "Table" SET "companyId" = 'default-company-seed';
ALTER TABLE "Table" ALTER COLUMN "companyId" SET NOT NULL;
DROP INDEX "Table_code_key";

-- AlterTable: Customer — rename company→employer, add companyId
ALTER TABLE "Customer" RENAME COLUMN "company" TO "employer";
ALTER TABLE "Customer" ADD COLUMN "companyId" TEXT;
UPDATE "Customer" SET "companyId" = 'default-company-seed';
ALTER TABLE "Customer" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable: Order — add companyId
ALTER TABLE "Order" ADD COLUMN "companyId" TEXT;
UPDATE "Order" SET "companyId" = 'default-company-seed';
ALTER TABLE "Order" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex: composite uniques
CREATE UNIQUE INDEX "User_email_companyId_key" ON "User"("email", "companyId");
CREATE UNIQUE INDEX "Table_code_companyId_key" ON "Table"("code", "companyId");
