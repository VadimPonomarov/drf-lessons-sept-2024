"use client";

import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent";
import { useAuthProviderContext } from "@/contexts/AuthProviderContext";
import { AuthProvider } from "@/common/interfaces/auth.interfaces";

export const MenuMain = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { authProvider } = useAuthProviderContext();

  const menuItems = useMemo(() => {
    const isDummy = authProvider === AuthProvider.Dummy;
    const isMyBackendDocs = authProvider === AuthProvider.MyBackendDocs;
    
    const items = [
      // Всегда показываем Home и Login
      { path: "/", label: "Home", disabled: false },
      { path: "/login", label: "Login", disabled: false },

      // Auth показываем только когда НЕ аутентифицирован
      ...(!isAuthenticated ? [{ 
        path: "/api/auth", 
        label: "Auth", 
        disabled: false
      }] : []),

      // Register показываем только для MyBackendDocs и когда НЕ аутентифицирован
      ...(isMyBackendDocs && !isAuthenticated ? [{ 
        path: "/register", 
        label: "Register", 
        disabled: false
      }] : []),

      // Logout показываем только когда аутентифицирован
      ...(isAuthenticated ? [{
        path: "#", 
        label: <FaSignOutAlt size={18} />, 
        disabled: false,
        cb: () => signOut({ callbackUrl: "/" }) 
      }] : []),

      // Users и Recipes показываем только для Dummy Auth и когда аутентифицирован
      ...(isDummy && isAuthenticated ? [
        { path: "/users", label: "Users", disabled: false },
        { path: "/recipes", label: "Recipes", disabled: false }
      ] : [])
    ];

    return items;
  }, [authProvider, isAuthenticated]);

  return <MenuComponent items={menuItems} className="fixed top-0 left-0" />;
};