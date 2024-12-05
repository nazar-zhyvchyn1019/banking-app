"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useUserContext } from "@/contexts/user";

export function Header() {
    const { address } = useUserContext();
    const copyAddress = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(address);
            alert("Address copied to clipboard!");
        } else {
            alert("Clipboard not supported in this browser.");
        }
    };
    return (
        <Fragment>
            <div className="fixed top-0 left-0 right-0  text-black pt-10 font-bold uppercase px-10 mb-5 py-3 border-b border-b-[#222] bg-white z-10">
                <div className="flex items-center justify-between container mx-auto">
                    <div className="flex items-center justify-start gap-1 text-3xl italic">
                        <Image
                            className="dark:invert "
                            src="/bank_card.png"
                            alt="Bank Card"
                            width={39}
                            height={38}
                            priority
                        />
                        <p className="md:block hidden">Banking APP</p>
                    </div>
                    <div onClick={copyAddress} className="hover:cursor-pointer">
                        {address}
                    </div>
                </div>
            </div>
            <div className="h-[90px]"></div>
        </Fragment>
    );
}
