"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge.tsx";
import { ISession } from "@/common/interfaces/session.interfaces.ts";

const AuthBadge: React.FC = () => {
  const session_data = useSession().data as unknown as ISession;

  return (
    <Badge variant={"destructive"}>
      <Link href={"/profile"}>{session_data?.email || "Guest"}</Link>
    </Badge>
  );
};

export default AuthBadge;
