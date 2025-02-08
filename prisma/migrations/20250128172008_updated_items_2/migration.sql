/*
  Warnings:

  - You are about to drop the column `addressCity` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `addressStreet` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `addressZip` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `imageHeight` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `imageWidth` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "addressCity",
DROP COLUMN "addressStreet",
DROP COLUMN "addressZip",
DROP COLUMN "imageHeight",
DROP COLUMN "imageWidth";
