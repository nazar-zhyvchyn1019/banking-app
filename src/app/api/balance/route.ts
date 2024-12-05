import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "Address is required",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        // Fetch the account by  address
        const account = await prisma.account.findUnique({
            where: { address: String(address) }, // Use the address to find the account
            select: { balance: true }, // Only fetch the balance
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

        // Send the balance as a response
        return new NextResponse(
            JSON.stringify({
                status: "success",
                balance: account.balance,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching balance:", error);
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "Internal server error ",
                errors: error,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

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
