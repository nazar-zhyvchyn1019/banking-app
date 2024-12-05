import prisma from "@/libs/prisma";

export const transferFund = async (
    senderAddress: string,
    receiverAddress: string,
    amount: number
) => {
    if (amount <= 0) {
        throw new Error("Transfer amount must be greater than zero.");
    }

    // Fetch sender and receiver accounts
    const sender = await prisma.account.findUnique({
        where: { address: senderAddress },
    });

    if (!sender) {
        throw new Error("Sender account not found.");
    }

    if (sender.balance < amount) {
        throw new Error("Insufficient funds.");
    }

    const receiver = await prisma.account.findUnique({
        where: { address: receiverAddress },
    });

    if (!receiver) {
        throw new Error("Receiver account not found.");
    }

    // Execute the transaction
    try {
        await prisma.$transaction([
            // Deduct from sender
            prisma.account.update({
                where: { address: senderAddress },
                data: {
                    balance: { decrement: amount },
                    transactions: {
                        create: {
                            type: "TRANSFER",
                            amount: -amount,
                            balance: sender.balance - amount,
                            description: `Transfer to ${receiverAddress}`,
                        },
                    },
                },
            }),
            // Add to receiver
            prisma.account.update({
                where: { address: receiverAddress },
                data: {
                    balance: { increment: amount },
                    transactions: {
                        create: {
                            type: "TRANSFER",
                            amount: amount,
                            balance: receiver.balance + amount,
                            description: `Transfer from ${senderAddress}`,
                        },
                    },
                },
            }),
        ]);
    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to process the transaction.");
    }
};
