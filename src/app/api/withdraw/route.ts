import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { address, amount } = await req.json();

    if (!address || !amount || amount <= 0) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "Invalid IBAN or amount",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    try {
        const account = await prisma.account.findUnique({
            where: { address },
        });

        if (!account) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Account not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (account.balance < amount) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Insufficient funds",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const updatedAccount = await prisma.account.update({
            where: { address },
            data: {
                balance: account.balance - amount,
                transactions: {
                    create: {
                        type: "WITHDRAW",
                        amount: -amount, // Positive for deposit,
                        balance: account.balance - amount,
                    },
                },
            },
            include: {
                transactions: true, // Optionally include transactions if needed in the response
            },
        });

        return NextResponse.json({ balance: updatedAccount.balance });
    } catch (error) {
        console.error("withdraw error", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
