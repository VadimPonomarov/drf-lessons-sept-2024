"use client";
import React, {FC} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SessionProvider} from "next-auth/react";

import {IProps} from ".";

const RootProvider: FC<IProps> = ({children}) => {

    return (
        <SessionProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
        </SessionProvider>

    );
};

const queryClient = new QueryClient();

export default RootProvider;
