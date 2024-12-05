"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavItem } from "@/types/nav";
import HomeIcon from "@/components/icons/home-icon";
import WalletIcon from "@/components/icons/wallet-icon";
import TransactionIcon from "@/components/icons/transaction-icon";
import ProfileIcon from "@/components/icons/profile-icon";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: NavItem[];
}

export function Sidebar({ className, items, ...props }: SidebarNavProps) {
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
