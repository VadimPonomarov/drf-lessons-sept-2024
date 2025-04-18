"use client";

import { useEffect, useState, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent";
import { IMenuItem } from "@/components/All/MenuComponent/menu.interfaces";
import { AuthProvider } from "@/common/interfaces/auth.interfaces";

export const MenuMain = () => {
  const { status } = useSession();
  const [currentAuthProvider, setCurrentAuthProvider] = useState<AuthProvider | null>(null);
  const isAuthenticated = status === "authenticated";

  // Получение провайдера из Redis
  useEffect(() => {
    const fetchAuthProvider = async () => {
      try {
        const response = await fetch("/api/redis?key=auth_provider");
        const data = await response.json();
        if (data?.value) setCurrentAuthProvider(data.value as AuthProvider);
      } catch (error) {
        console.error("Redis fetch error:", error);
      }
    };

    fetchAuthProvider();
    const interval = setInterval(fetchAuthProvider, 1000);
    return () => clearInterval(interval);
  }, []);

  // Формирование пунктов меню
  const menuItems = useMemo(() => {
    const isDummy = currentAuthProvider === AuthProvider.Dummy;
    
    return [
      { path: "/", label: "Home", disabled: false },
      // Register только для Dummy Auth
      ...(isDummy ? [{ 
        path: "/register", 
        label: "Register", 
        disabled: !isAuthenticated 
      }] : []),
      // Базовые пункты авторизации
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
      // Дополнительные пункты для Dummy Auth
      ...(isDummy ? [
        { path: "/users", label: "Users" },
        { path: "/recipes", label: "Recipes" }
      ] : [])
    ];
  }, [currentAuthProvider, isAuthenticated]);

  return <MenuComponent items={menuItems} className="fixed top-0 left-0" />;
};