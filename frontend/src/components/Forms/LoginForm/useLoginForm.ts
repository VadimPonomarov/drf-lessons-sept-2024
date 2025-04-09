"use client";
import {useEffect, useState} from "react";
import {joiResolver} from "@hookform/resolvers/joi";
import {SubmitHandler, useForm} from "react-hook-form";
import {signIn, useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {setCookie} from "cookies-next";
import {IDummyAuth} from "@/common/interfaces/dummy.interfaces.ts";
import {FormFieldsConfig} from "@/common/interfaces/forms.interfaces.ts";
import {IUserSession} from "@/common/interfaces/users.interfaces.ts";

import {schema} from "./index.joi";

export const formFields: FormFieldsConfig<IDummyAuth> = [
    {name: "username", label: "Username", type: "text"},
    {name: "password", label: "Password", type: "password"},
    {name: "expiresInMins", label: "Expires in Minutes", type: "number"},
];

export const useLoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const defaultValues: IDummyAuth = {username: "", password: "", expiresInMins: null};
    const router = useRouter()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const {data: session} = useSession();


    useEffect(() => {
        if (session?.user) {
            const {accessToken} = session.user as IUserSession;
            if (accessToken) {
                setCookie("accessToken", accessToken, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 30,
                    path: '/',
                });
            }
        }
    }, [session?.user]);

    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
        reset,
    } = useForm<IDummyAuth>({
        resolver: joiResolver(schema),
        defaultValues,
        mode: "all",
    });

    const onSubmit: SubmitHandler<IDummyAuth> = async (data) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                username: data.username,
                password: data.password,
                expiresInMins: Number(data.expiresInMins),
                callbackUrl,
            });

            if (result && result.url) {
                router.push(result.url);
            } else {
                console.error("No redirect URL found in the result");
                setError("No redirect URL found in the result");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error during sign in", error.message);
                setError(error.message);
            } else {
                console.error("Unexpected error", error);
                setError("An unexpected error occurred.");
            }
        }
    };


    return {
        register,
        handleSubmit,
        errors,
        isValid,
        reset,
        onSubmit,
        error,
        setError,
        defaultValues,
    };
};
