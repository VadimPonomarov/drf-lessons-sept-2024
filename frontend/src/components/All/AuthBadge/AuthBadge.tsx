"use client";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge.tsx";
import Link from "next/link";
import { IUserSession } from "@/common/interfaces/users.interfaces.ts";

const AuthBadge: React.FC = () => {
    const { data: session, status } = useSession();
    const user = session?.user as IUserSession | undefined;

    if (status === "loading") {
        return null;
    }

    if (status === "authenticated" && user) {
        return (
            <Badge variant={"destructive"}>
                <Link href={"/profile"}>
                    {user.firstName}
                </Link>
            </Badge>
        );
    }

    return null;
};

export default AuthBadge;


