import prisma from "@/libs/prisma";

import { transferFund } from "./transfer";

// Mock Prisma client
jest.mock("@/libs/prisma", () => import("@/__mocks__/prisma"));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("transferFund", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully transfer funds between accounts", async () => {
        // Mock sender and receiver accounts
        prismaMock.account.findUnique
            .mockResolvedValueOnce({ address: "senderAddress", balance: 500 }) // Mock sender
            .mockResolvedValueOnce({
                address: "receiverAddress",
                balance: 300,
            }); // Mock receiver

        // Mock successful transaction
        prismaMock.$transaction.mockResolvedValueOnce(undefined);

        await expect(
            transferFund("senderAddress", "receiverAddress", 100)
        ).resolves.not.toThrow();

        expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
            where: { address: "senderAddress" },
        });
        expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
            where: { address: "receiverAddress" },
        });
        expect(prismaMock.$transaction).toHaveBeenCalled();
    });

    it("should throw an error if the sender account is not found", async () => {
        prismaMock.account.findUnique.mockResolvedValueOnce(null); // Sender not found

        await expect(
            transferFund("senderAddress", "receiverAddress", 100)
        ).rejects.toThrow("Sender account not found.");

        expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
            where: { address: "senderAddress" },
        });
        expect(prismaMock.account.update).not.toHaveBeenCalled();
    });

    it("should throw an error if the sender has insufficient funds", async () => {
        prismaMock.account.findUnique
            .mockResolvedValueOnce({ address: "senderAddress", balance: 50 }) // Sender has insufficient balance
            .mockResolvedValueOnce({
                address: "receiverAddress",
                balance: 300,
            });

        await expect(
            transferFund("senderAddress", "receiverAddress", 100)
        ).rejects.toThrow("Insufficient funds.");

        expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
            where: { address: "senderAddress" },
        });
        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("should throw an error if the receiver account is not found", async () => {
        prismaMock.account.findUnique
            .mockResolvedValueOnce({ address: "senderAddress", balance: 500 }) // Sender found
            .mockResolvedValueOnce(null); // Receiver not found

        await expect(
            transferFund("senderAddress", "receiverAddress", 100)
        ).rejects.toThrow("Receiver account not found.");

        expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
            where: { address: "receiverAddress" },
        });
        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("should throw an error for invalid transfer amounts", async () => {
        await expect(
            transferFund("senderAddress", "receiverAddress", -100)
        ).rejects.toThrow("Transfer amount must be greater than zero.");

        expect(prismaMock.account.findUnique).not.toHaveBeenCalled();
        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });
});
