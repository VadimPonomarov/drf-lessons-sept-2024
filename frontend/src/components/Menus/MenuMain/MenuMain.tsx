"use client";

import MenuComponent from "@/components/All/MenuComponent/MenuComponent.tsx";
import {signOut, useSession} from "next-auth/react";
import {IMenuItem} from "@/components/All/MenuComponent/menu.interfaces.ts";
import {FaSignOutAlt} from "react-icons/fa";

export const MenuMain = () => {
    const {status} = useSession();

    const handleSignOut = () => {
        signOut({callbackUrl: "/"});
    };

    const menuItems: IMenuItem[] = [
        {path: "/", label: "Home", disabled: false},
        {path: "/users", label: "Users"},
        {path: "/recipes", label: "Recipes"},
        {path: "/api/auth", label: "Auth", disabled: status === "authenticated"},
        {
            path: "#",
            label: <FaSignOutAlt size={18}/>,
            disabled: status !== "authenticated",
            cb: handleSignOut,
        },
    ];

    return <MenuComponent items={menuItems} className={"fixed top-0 left-0"}/>;
};


