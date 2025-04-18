"use client";

import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent";

export const MenuMain = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Формирование пунктов меню
  const menuItems = useMemo(() => {
    // Базовые пункты меню, доступные всегда
    return [
      { path: "/", label: "Home", disabled: false },
      { 
        path: "/login", 
        label: "Login", 
        disabled: !isAuthenticated 
      },
      { 
        path: "/api/auth", 
        label: "Auth", 
        disabled: isAuthenticated 
      },
      { 
        path: "#", 
        label: <FaSignOutAlt size={18} />, 
        disabled: !isAuthenticated,
        cb: () => signOut({ callbackUrl: "/" }) 
      },
      { path: "/users", label: "Users" },
      { path: "/recipes", label: "Recipes" }
    ];
  }, [isAuthenticated]);

  return <MenuComponent items={menuItems} className="fixed top-0 left-0" />;
};