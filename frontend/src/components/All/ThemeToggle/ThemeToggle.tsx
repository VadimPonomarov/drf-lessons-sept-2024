"use client"
import {MoonIcon, SunIcon} from "@heroicons/react/16/solid";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button
            data-testid="theme-toggle-button"
            variant={"destructive"}
            onClick={toggleTheme}
            className={"theme-switch z-50"}
        >
            {theme === "light" ? (
                <MoonIcon data-testid="moon-icon"/>
            ) : (
                <SunIcon data-testid="sun-icon"/>
            )}
        </Button>
    );
}

export default ThemeToggle;
