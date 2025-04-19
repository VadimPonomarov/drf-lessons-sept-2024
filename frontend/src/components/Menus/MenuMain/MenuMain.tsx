"use client";

import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent";
import { useAuthProviderContext } from "@/contexts/AuthProviderContext";
import { AuthProvider } from "@/common/interfaces/auth.interfaces";
import { IMenuItem } from "@/components/All/MenuComponent/menu.interfaces";
import { useRouter } from "next/navigation";

export const MenuMain = () => {
  const { authProvider, setAuthProvider } = useAuthProviderContext();
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = useMemo(() => {
    console.log("Building menu items for auth provider:", authProvider);
    const isDummy = authProvider === AuthProvider.Dummy;
    const isAuthenticated = !!session;

    const commonItems: IMenuItem[] = [
      { path: "/", label: "Home", disabled: false },
      { path: "/login", label: "Login", disabled: false },
      { path: "/api/auth", label: "Auth", disabled: isAuthenticated },
    ];

    const dummyItems: IMenuItem[] = [
      { path: "/users", label: "Users", disabled: false },
      { path: "/recipes", label: "Recipes", disabled: false },
    ];

    // Register link only shown for non-Dummy provider
    const registerItem: IMenuItem[] = !isDummy
      ? [{ path: "/register", label: "Register", disabled: false }]
      : [];

    // Sign out button
    const signOutItem = isAuthenticated
      ? [
          {
            path: "#",
            label: <FaSignOutAlt size={18} />,
            disabled: false,
            cb: () => signOut({ callbackUrl: "/" }),
          },
        ]
      : [];

    const items = [
      ...commonItems,
      ...(isDummy ? dummyItems : []),
      ...registerItem,
      ...signOutItem,
    ];

    return items;
  }, [authProvider, session]);

  return <MenuComponent items={menuItems} className="fixed top-0 left-0" />;
};
