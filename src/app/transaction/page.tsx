"use client";

import { useState, useEffect } from "react";

import { useUserContext } from "@/contexts/user";

interface Transaction {
    id: string;
    amount: number;
    balance: number;
    type: string;
    createdAt: string;
}

export default function TransactionHistory() {
    const { address } = useUserContext();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/transaction?address=${address}`
                );
                if (!response.ok) {
                    const data = await response.json();
                    setError(
                        data.message || "Failed to fetch transaction history."
                    );
                } else {
                    const data = await response.json();
                    setTransactions(data.transactions);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError(
                    "An error occurred while fetching transaction history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [address]);

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-center">
                Transaction History
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : transactions.length > 0 ? (
                <table className="w-full mt-4 border-collapse border border-gray-300  md:max-w-[640px]">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">
                                Date
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Amount
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Balance
                            </th>
                            <th className="border border-gray-300 px-4 py-2 md:table-cell hidden">
                                Type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {new Date(
                                        transaction.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td
                                    className={`border border-gray-300 px-4 py-2 text-center ${
                                        transaction.amount < 0
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }`}
                                >
                                    {transaction.amount < 0 ? "-" : "+"}$
                                    {Math.abs(transaction.amount)}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    ${transaction.balance.toFixed(2)}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 md:table-cell hidden text-center">
                                    {transaction.type}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
}
