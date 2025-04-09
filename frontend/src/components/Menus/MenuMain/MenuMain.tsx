"use client";

import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent.tsx";
import { IMenuItem } from "@/components/All/MenuComponent/menu.interfaces.ts";

export const MenuMain = () => {
  const { status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const menuItems: IMenuItem[] = [
    { path: "/", label: "Home", disabled: false },
    { path: "/users", label: "Users" },
    { path: "/recipes", label: "Recipes" },
    {
      path: "/api/auth/signin",
      label: "Auth",
      disabled: status === "authenticated",
    },
    {
      path: "#",
      label: <FaSignOutAlt size={18} />,
      disabled: status !== "authenticated",
      cb: handleSignOut,
    },
  ];

  return <MenuComponent items={menuItems} className={"fixed top-0 left-0"} />;
};
