import "./globals.css";
import React from "react";
import {PageTracker} from "react-page-tracker";

import {MenuMain} from "@/components/Menus/MenuMain/MenuMain";
import RootProvider from "@/common/providers/RootProvider";
import ThemeToggle from "@/components/All/ThemeToggle/ThemeToggle.tsx";
import AuthBadge from "@/components/All/AuthBadge/AuthBadge.tsx";
import {MagicBackButton} from "@/components/ui/magicBackButton.tsx";
import {geistMono, geistSans} from "./constants";
import css from "./index.module.css";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className={"fixed top-3 left-3 z-50"}>
            <PageTracker/>
            <MagicBackButton variant={"ghost"} className={"w-5 h-5 text-white"}/>
        </div>
        <RootProvider>
                <div className={css.main}>
                    <PageTracker/>
                    <MenuMain/>
                    <span className={"fixed right-[50px] top-2 z-50"}>
                    <AuthBadge/>
                </span>
                    <ThemeToggle/>
                    {children}
                </div>

        </RootProvider>
        </body>
        </html>
    );
}
