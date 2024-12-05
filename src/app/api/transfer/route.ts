import { NextResponse } from "next/server";

import prisma from "@/libs/prisma";

import { transferFund } from "./transfer";

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

        transferFund(senderAddress, recipient, amount);

        return NextResponse.json({ balance: sender.balance - amount });
    } catch (error) {
        console.error("Transfer error", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
