/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GLOBAL_ADMIN', 'GLOBAL_SUPPORT', 'PROVIDER_ADMIN', 'PROVIDER_SUPPORT', 'SUPPLIER_ADMIN', 'SUPPLIER_SUPPORT', 'CLIENT_ADMIN', 'CLINET_SUPPORT', 'END_USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'END_USER';

-- DropTable
DROP TABLE "images";
