"use client";

import { NavItem } from "@/types/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@/components/imgs/home_icon";
import WalletIcon from "@/components/imgs/wallet_icon";
import TransactionIcon from "@/components/imgs/transaction_icon";
import ProfileIcon from "@/components/imgs/profile_icon";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: NavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className={[
                "hidden md:flex flex-col gap-6 px-3 sticky",
                className,
            ].join(" ")}
            {...props}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 link ${
                        pathname === item.href
                            ? "active text-[#0064FF] "
                            : "text-[#606060]"
                    } ${item.disabled ? "pointer-events-none opacity-60" : ""}`}
                    aria-disabled={item.disabled}
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
            ))}
        </nav>
    );
}
