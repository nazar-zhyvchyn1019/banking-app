import prisma from "@/libs/prisma";
import { generateIbanAddress } from "@/libs/iban";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        let ibanAddress: string;
        let exists = true;
        do {
            ibanAddress = generateIbanAddress();
            // Check if the IBAN exists in the Account table
            exists =
                (await prisma.account.findUnique({
                    where: { address: ibanAddress },
                })) !== null;
        } while (exists);

        // Create Account
        await prisma.account.create({
            data: {
                address: ibanAddress,
                balance: 0.0, // Initial balance
            },
        });

        return new NextResponse(
            JSON.stringify({
                status: "success",
                address: ibanAddress,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "erorr ",
                errors: error,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
