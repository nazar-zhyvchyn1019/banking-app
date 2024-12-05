import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const address = req.nextUrl.searchParams.get("address");
    console.log("first", address);

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
        // Fetch account to ensure the IBAN exists
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

        // Fetch transaction history for the IBAN
        const transactions = await prisma.transaction.findMany({
            where: { accountId: account.id },
            orderBy: { createdAt: "desc" }, // Sort by most recent transactions
        });
        return NextResponse.json({ transactions });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
