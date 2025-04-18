"use client";

import { FC } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoginForm from "@/components/Forms/LoginForm/LoginForm";

const LoginPage: FC = () => {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    return (
        <>
            {message && (
                <Alert className="mb-4">
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}
            <LoginForm />
        </>
    );
};

export default LoginPage;
