"use client";

import { useUserContext } from "@/state/User";
import { useCallback, useState } from "react";

export default function WithdrawAndDeposit({
    type = "withdraw",
}: {
    type?: "withdraw" | "deposit";
}) {
    const { address, setBalance } = useUserContext();

    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTransaction = useCallback(async () => {
        console.log("first", address, amount);
        if (!address || amount <= 0) {
            setError("Invalid IBAN or amount.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address, amount }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "An error occurred");
            } else {
                const data = await response.json();
                setBalance(data.balance);
                setAmount(0);
            }
        } catch (err) {
            console.error("Error during transaction:", err);
            setError("An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    }, [address, amount, setBalance, type]);
    return (
        <div className="flex flex-col  items-center gap-5 border border-solid border-[#B1B1B1] p-3 rounded-lg">
            <h1 className="uppercase">{type}</h1>
            <div className="relative">
                <p className="absolute left-3 top-[50%] translate-y-[-50%] text-xl font-bold">
                    $
                </p>
                <input
                    type="number"
                    placeholder="amount"
                    className="min-w-[300px] md:w-auto w-full px-6 h-12 bg-[#F6FAFF] border border-solid border-[#E2EFFF] rounded-[5px]"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>
            <button
                onClick={handleTransaction}
                disabled={loading}
                className="min-w-[300px] md:w-auto w-full h-12 bg-[#0064FF] rounded-[5px] text-center capitalize text-white hover:opacity-80"
            >
                {type}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
