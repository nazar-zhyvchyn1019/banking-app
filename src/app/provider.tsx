"use client";

import { Fragment } from "react";
import { Analytics } from "@vercel/analytics/react";

import { UserContextProvider } from "@/contexts/user";

export function ContextProvider({ children, ...props }) {
    return (
        <Fragment {...props}>
            <UserContextProvider>{children}</UserContextProvider>
            <Analytics />
        </Fragment>
    );
}
