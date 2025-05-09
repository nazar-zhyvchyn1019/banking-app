import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prisma";

export async function GET(req: NextRequest) {
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
        console.log("Error fetching balance:", error);
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
