"use client";

import { Fragment } from "react";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Fragment>{children}</Fragment>;
}
