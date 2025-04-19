"use client";

import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt, FaBook } from "react-icons/fa";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent";
import { useAuthProviderContext } from "@/contexts/AuthProviderContext";
import { AuthProvider } from "@/common/interfaces/auth.interfaces";
import { IMenuItem } from "@/components/All/MenuComponent/menu.interfaces";
import { useRouter, usePathname } from "next/navigation";

export const MenuMain = () => {
  const { authProvider } = useAuthProviderContext();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = useMemo(() => {
    const isAuthenticated = !!session;
    const isDummy = authProvider === AuthProvider.Dummy;
    const hasSelectedProvider = authProvider !== AuthProvider.Select;

    // Базовые пункты меню - доступны всегда
    const baseItems: IMenuItem[] = [
      { path: "/", label: "Home", disabled: false },
    ];

    // Добавляем Login если есть сессия (даже невалидная)
    if (session !== null) {
      baseItems.push({ path: "/login", label: "Login", disabled: false });
    }

    // До выбора провайдера показываем только базовые пункты
    if (!hasSelectedProvider) {
      return baseItems;
    }

    // После выбора провайдера
    const additionalItems = isAuthenticated 
      ? [ // Для авторизованного пользователя
          { path: "/users", label: "Users", disabled: false },
          { path: "/recipes", label: "Recipes", disabled: false },
          ...(isDummy ? [] : [{
            path: '/docs',
            label: (
              <div className="flex items-center gap-2">
                <FaBook size={16} />
                <span>Docs</span>
              </div>
            ),
            disabled: false
          }]),
          {
            path: "#",
            label: <FaSignOutAlt size={18} />,
            disabled: false,
            cb: () => signOut({ callbackUrl: "/" }),
          },
        ]
      : [ // Для неавторизованного пользователя
          { path: "/api/auth", label: "Auth", disabled: false },
          ...(isDummy ? [] : [{
            path: '/docs',
            label: (
              <div className="flex items-center gap-2">
                <FaBook size={16} />
                <span>Docs</span>
              </div>
            ),
            disabled: false
          }]),
        ];

    return [...baseItems, ...additionalItems];
  }, [authProvider, session, pathname]);

  return <MenuComponent items={menuItems} className="fixed top-0 left-0" />;
};