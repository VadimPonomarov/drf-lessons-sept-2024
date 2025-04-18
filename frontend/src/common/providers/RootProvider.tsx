"use client";
import React, { FC } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProviderProvider } from "@/contexts/AuthProviderContext";

import { IProps } from ".";

const queryClient = new QueryClient();

const RootProvider: FC<IProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <AuthProviderProvider>
                    {children}
                </AuthProviderProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};

export default RootProvider;