"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getRedisData, setRedisData } from "@/services/redis/redisService";
import MenuComponent from "@/components/All/MenuComponent/MenuComponent.tsx";
import { IMenuItem } from "@/components/All/MenuComponent/menu.interfaces.ts";
import { Switch } from "@/components/ui/switch";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import css from "@/components/all/MenuComponent/menu.module.css";

export const MenuMain = () => {
  const { status } = useSession();
  const [showFirstMenu, setShowFirstMenu] = useState(true);
  const pathName = usePathname();

  useEffect(() => {
    const loadMenuState = async () => {
      try {
        const savedState = await getRedisData('menu_state');
        if (savedState !== null) {
          setShowFirstMenu(savedState === 'true');
        }
      } catch (error) {
        console.error('Failed to load menu state:', error);
        // Используем значение по умолчанию в случае ошибки
        setShowFirstMenu(true);
      }
    };

    loadMenuState();
  }, []);

  const handleMenuToggle = async (checked: boolean) => {
    setShowFirstMenu(checked);
    try {
      await setRedisData('menu_state', checked.toString(), 86400); // Хранить 24 часа
    } catch (error) {
      console.error('Failed to save menu state:', error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Статичные пункты меню, которые всегда видны (без Auth)
  const staticMenuItems: IMenuItem[] = [
    { path: "/", label: "Home" }
  ];

  // Auth пункт меню
  const authMenuItem: IMenuItem = { 
    path: "/api/auth", 
    label: "Auth" 
  };

  // Пункты меню, доступные только аутентифицированным пользователям
  const mainMenuItems: IMenuItem[] = [
    { path: "/users", label: "Users", disabled: status !== "authenticated" },
    { path: "/recipes", label: "Recipes", disabled: status !== "authenticated" },
  ];

  // Выпадающее меню Features
  const FeaturesMenu = () => {
    const featureRoutes = ['/feature1', '/feature2', '/feature3'];
    const isActive = featureRoutes.includes(pathName);
    
    return (
      <span className={`border-b-2 ${status !== "authenticated" ? "hidden" : ""}`}>
        <MenubarMenu>
          <div className={(isActive && css.active) || "false"}>
            <MenubarTrigger>Features</MenubarTrigger>
          </div>
          <MenubarContent>
            <MenubarItem>
              <Link href="/feature1">Feature 1</Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/feature2">Feature 2</Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/feature3">Feature 3</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </span>
    );
  };

  // Второй блок меню (Features как один пункт с выпадающим списком)
  const secondaryMenuItems: IMenuItem[] = [
    { path: "#", label: <FeaturesMenu />, disabled: status !== "authenticated" },
  ];

  // Кнопка выхода (видна только аутентифицированным пользователям)
  const logoutButton: IMenuItem = {
    path: "/logout",
    label: <FaSignOutAlt size={18} />,
    disabled: status !== "authenticated",
    cb: handleSignOut,
  };

  // Комбинируем меню в зависимости от состояния переключателя и аутентификации
  const visibleMenuItems = [
    ...staticMenuItems,
    ...(status === "authenticated" ? [
      ...(showFirstMenu ? mainMenuItems : secondaryMenuItems)
    ] : []),
    authMenuItem,
    ...(status === "authenticated" ? [logoutButton] : [])
  ];

  return (
    <div className="relative">
      <MenuComponent
        items={visibleMenuItems}
        className={"fixed top-0 left-0"}
      />
      {status === "authenticated" && (
        <div className="fixed top-2 left-[60px] z-50 flex items-center gap-2">
          <Switch
            checked={showFirstMenu}
            onCheckedChange={handleMenuToggle}
            className="bg-zinc-700 data-[state=checked]:bg-orange-500"
          />
          <span className="text-sm text-white">
            {showFirstMenu ? "Switch to Control Test 2" : "Switch to Control Test 1"}
          </span>
        </div>
      )}
    </div>
  );
};
