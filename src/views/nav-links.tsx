"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@/components/icons/home-icon";
import WalletIcon from "@/components/icons/wallet-icon";
import TransactionIcon from "@/components/icons/transaction-icon";
import ProfileIcon from "@/components/icons/profile-icon";
import { NavItem } from "@/types/nav";

export function NavLinks({
    className = "",
    items,
}: {
    className?: string;
    items: NavItem[];
}) {
    const pathname = usePathname();

    return (
        <nav className={["flex items-center gap-5", className].join(" ")}>
            {items.map((item) => {
                return (
                    <Link
                        key={item.title}
                        className={`flex flex-col items-center link ${
                            pathname === item.href
                                ? "active text-[#0064FF] "
                                : "text-[#606060]"
                        } ${
                            item.disabled
                                ? "pointer-events-none opacity-60"
                                : ""
                        }`}
                        href={item.href}
                    >
                        {item.title == "Home" ? (
                            <HomeIcon />
                        ) : item.title == "Transaction" ? (
                            <TransactionIcon />
                        ) : item.title == "Wallet" ? (
                            <WalletIcon />
                        ) : (
                            <ProfileIcon />
                        )}
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
