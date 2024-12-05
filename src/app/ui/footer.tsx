"use client";

import { navLinks } from "@/config/links";
import { NavLinks } from "./nav-links";

export function Footer() {
    return (
        <footer className="md:hidden fixed left-0 right-0 bottom-0  bg-white border-t border-t-[#222]  text-white font-bold  flex items-center justify-between px-10 py-3">
            <NavLinks items={navLinks} className="w-full justify-between" />
        </footer>
    );
}
