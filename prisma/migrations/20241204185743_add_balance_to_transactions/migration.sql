/*
  Warnings:

  - Added the required column `balance` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;
