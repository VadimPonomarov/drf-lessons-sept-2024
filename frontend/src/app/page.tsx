import React, { FC } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import SimpleAlert from "@/components/All/Alerts/SimpleAlert.tsx";

import { getMetadata } from "./index.metadata";

const Home: FC = async () => {
    const session = await getServerSession();
    if (session?.user) return <h1>Home</h1>;

    return (
            <SimpleAlert>
                <div className="text-2xl">
                    Hi Bud!! <br />
                    You&apos;re still not authenticated.
                    <br />
                    Please login. <br />
                    <Link className="text-blue-500 hover:text-blue-700 underline" href="/api/auth">
                        Here is your link ...
                    </Link>
                    <br />
                </div>
            </SimpleAlert>
    );
};

export const metadata: Metadata = await getMetadata({
    title: "Home",
    description: "...",
});

export default Home;

