"use client";

import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent";
import { useAuthProviderContext } from "@/contexts/AuthProviderContext";
import { AuthProvider } from "@/common/interfaces/auth.interfaces";
import { IMenuItem } from "@/components/All/MenuComponent/menu.interfaces";

export const MenuMain = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { authProvider } = useAuthProviderContext();

  const menuItems = useMemo(() => {
    const isDummy = authProvider === AuthProvider.Dummy;
    const isMyBackendDocs = authProvider === AuthProvider.MyBackendDocs;
    
    const items: IMenuItem[] = [
      { path: "/", label: "Home", disabled: false },
    ];

    if (!isAuthenticated) {
      items.push({ 
        path: "/api/auth", 
        label: "Auth", 
        disabled: false 
      });
      return items;
    }

    items.push(
      { path: "/login", label: "Login", disabled: false },
      
      ...(isMyBackendDocs ? [{ 
        path: "/register", 
        label: "Register", 
        disabled: false 
      }] : []),

      {
        path: "#", 
        label: <FaSignOutAlt size={18} />, 
        disabled: false,
        cb: () => signOut({ callbackUrl: "/" }) 
      },

      ...(isDummy ? [
        { path: "/users", label: "Users", disabled: false },
        { path: "/recipes", label: "Recipes", disabled: false }
      ] : [])
    );

    return items;
  }, [authProvider, isAuthenticated]);

  return <MenuComponent items={menuItems} className="fixed top-0 left-0" />;
};