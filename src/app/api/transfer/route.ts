import { NextResponse } from "next/server";

import prisma from "@/libs/prisma";

// transfter function
export async function POST(req: Request) {
    const { senderAddress, recipient, amount } = await req.json();

    if (!recipient || amount <= 0) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "Invalid recipient or amount",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    try {
        const sender = await prisma.account.findUnique({
            where: { address: senderAddress },
        });
        const receiver = await prisma.account.findUnique({
            where: { address: recipient },
        });

        if (!sender) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Sender account not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (!receiver) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Recipient account not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Ensure sender has enough balance
        if (sender.balance < amount) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Insufficient funds",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

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
                            description: `Transfer to ${recipient}`,
                        },
                    },
                },
            }),
            // Add to recipient
            prisma.account.update({
                where: { address: recipient },
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

        return NextResponse.json({ balance: sender.balance - amount });
    } catch (error) {
        console.error("Transfer error", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
