import { NavItem } from "@/types/nav";

export const navLinks: NavItem[] = [
    {
        title: "Home",
        href: "/home",
    },
    {
        title: "Transaction",
        href: "/transaction",
    },
    {
        title: "Wallet",
        href: "/wallet",
    },
    {
        title: "Profile",
        href: "/profile",
        disabled: true,
    },
];
