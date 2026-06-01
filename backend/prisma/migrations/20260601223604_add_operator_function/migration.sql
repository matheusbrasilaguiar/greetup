-- CreateEnum
CREATE TYPE "OperatorFunction" AS ENUM ('COZINHA', 'GARCOM', 'DISPLAY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "operatorFunction" "OperatorFunction";
