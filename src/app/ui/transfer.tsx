"use client";
import { useState } from "react";

import { useUserContext } from "@/contexts/user";
import { isValidIBANNumber } from "@/libs/iban";

export default function Transfer() {
    const { address, setBalance } = useUserContext();
    const [recipient, setRecipient] = useState(""); // Recipient account (e.g., IBAN)
    const [amount, setAmount] = useState(""); // Transfer amount
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // Success message

    const handleTransfer = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Input validation
        if (!recipient || !amount || Number(amount) <= 0) {
            setError("Please enter a valid recipient and amount.");
            setLoading(false);
            return;
        }

        if (!isValidIBANNumber(recipient)) {
            setError("The Recipient address is not iban address");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderAddress: address,
                    recipient,
                    amount: Number(amount),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Transfer failed. Please try again.");
            } else {
                setBalance(data.balance);
                setAmount("0");
                setSuccess("Transfer successful!");
            }
        } catch (err) {
            console.log("Transfer error:", err);
            setError("An error occurred while processing the transfer.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col  items-center gap-5 border border-solid border-[#B1B1B1] p-3 rounded-lg">
            <h1 className="uppercase">Transfer</h1>
            <div className="relative">
                <input
                    placeholder="Recipient Account"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="min-w-[300px] md:w-auto w-full px-6 h-12 bg-[#F6FAFF] border border-solid border-[#E2EFFF] rounded-[5px]"
                />
            </div>
            <div className="relative">
                <p className="absolute left-3 top-[50%] translate-y-[-50%] text-xl font-bold">
                    $
                </p>

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="min-w-[300px] md:w-auto w-full px-6 h-12 bg-[#F6FAFF] border border-solid border-[#E2EFFF] rounded-[5px]"
                />
            </div>
            <button
                onClick={handleTransfer}
                disabled={loading}
                className="min-w-[300px] md:w-auto w-full h-12 bg-[#0064FF] rounded-[5px] text-center capitalize text-white hover:opacity-80"
            >
                {loading ? "Processing..." : "Transfer"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
    );
}
