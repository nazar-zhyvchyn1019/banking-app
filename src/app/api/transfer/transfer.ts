import prisma from "@/libs/prisma";

export const transferFund = async (
    senderAddress: string,
    senderBalance: number,
    amount: number,
    receiverAddress: string,
    receiverBalance: number
) => {
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
                        balance: senderBalance - amount,
                        description: `Transfer to ${receiverAddress}`,
                    },
                },
            },
        }),
        // Add to recipient
        prisma.account.update({
            where: { address: receiverAddress },
            data: {
                balance: { increment: amount },
                transactions: {
                    create: {
                        type: "TRANSFER",
                        amount: amount,
                        balance: receiverBalance + amount,
                        description: `Transfer from ${senderAddress}`,
                    },
                },
            },
        }),
    ]);
};
