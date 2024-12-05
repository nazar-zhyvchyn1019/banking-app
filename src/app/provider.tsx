"use client";

import { Fragment } from "react";
import { UserContextProvider } from "@/state/User";

export function ContextProvider({ children, ...props }) {
    return (
        <Fragment {...props}>
            <UserContextProvider>{children}</UserContextProvider>
        </Fragment>
    );
}
