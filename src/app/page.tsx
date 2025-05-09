"use client";

import { useCallback, useEffect, useState } from "react";

import DepositIcon from "@/components/icons/deposit-icon";
import TransferIcon from "@/components/icons/transfer-icon";
import WithdrawIcon from "@/components/icons/withdraw-icon";
import WithdrawAndDeposit from "@/app/ui/withdraw-and-deposit";
import Transfer from "@/app/ui/transfer";
import { useUserContext } from "@/contexts/user";

export default function Home() {
    const [tab, setTab] = useState<"withdraw" | "deposit" | "transfer">(
        "withdraw"
    );

    const { address, balance, setBalance } = useUserContext();

    const handleSelectTab = useCallback(
        (tab: "withdraw" | "deposit" | "transfer") => {
            setTab(tab);
        },
        []
    );

    useEffect(() => {
        const fetchBalance = async () => {
            if (!address) return; // Exit if Address is not set yet

            try {
                const response = await fetch(`/api/balance?address=${address}`);
                if (!response.ok) {
                    const data = await response.json();
                    console.log("Error fetching balance:", data.message);
                    return;
                }
                const data = await response.json();
                setBalance(data.balance); // Update state with the fetched balance
            } catch (error) {
                console.log("Error fetching balance:", error);
            }
        };

        fetchBalance();
    }, [address, setBalance]);

    return (
        <div className="flex flex-col w-full relative gap-10 text-[#000E24]">
            <div className="flex flex-col gap-10 items-center justify-between w-full  rounded-[10px] p-5">
                <div className="flex flex-col justify-center items-center gap-1">
                    <h1 className="font-bold text-md text-[#A1A1A1]">
                        Account Balance
                    </h1>
                    <p className="text-5xl font-bold">$ {balance}</p>
                </div>
                <div className="flex items-center justify-center gap-10">
                    <button
                        className="flex flex-col gap-1 items-center justify-center"
                        onClick={() => handleSelectTab("withdraw")}
                    >
                        <div className="w-[50px] h-[50px] bg-[#0064FF] rounded-full flex items-center justify-center">
                            <WithdrawIcon />
                        </div>
                        Withdraw
                    </button>
                    <button
                        className="flex flex-col gap-1 items-center justify-center"
                        onClick={() => handleSelectTab("transfer")}
                    >
                        <div className="w-[50px] h-[50px] bg-[#0064FF] rounded-full flex items-center justify-center">
                            <TransferIcon />
                        </div>
                        Transfter
                    </button>
                    <button
                        className="flex flex-col gap-1 items-center justify-center"
                        onClick={() => handleSelectTab("deposit")}
                    >
                        <div className="w-[50px] h-[50px] bg-[#0064FF] rounded-full flex items-center justify-center">
                            <DepositIcon />
                        </div>
                        Deposit
                    </button>
                </div>
                {tab === "withdraw" && <WithdrawAndDeposit />}
                {tab === "deposit" && <WithdrawAndDeposit type="deposit" />}
                {tab === "transfer" && <Transfer />}
            </div>
        </div>
    );
}
