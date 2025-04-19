"use client";

import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IRegistration } from "@/common/interfaces/auth.interfaces";
import { FormFieldsConfig } from "@/common/interfaces/forms.interfaces";
import { ISession } from "@/common/interfaces/session.interfaces";
import { fetchUserCreate } from "@/app/api/helpers";

import { schema } from "./index.joi";

export const formFields: FormFieldsConfig<IRegistration> = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

export const useRegistrationForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: sessionData } = useSession();
    const session = sessionData as unknown as ISession;
    
    const defaultValues: IRegistration = {
        email: session?.email || "",
        password: "",
        confirmPassword: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
    } = useForm<IRegistration>({
        resolver: joiResolver(schema),
        defaultValues,
        mode: "all",
    });

    const onSubmit: SubmitHandler<IRegistration> = async (data) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetchUserCreate({
                email: data.email,
                password: data.password
            });

            if (!response) {
                throw new Error("Registration failed");
            }

            if (response.error) {
                // Handle specific error messages from the backend
                if (response.error.email) {
                    setError(response.error.email[0]);
                    return;
                }
                throw new Error(response.error);
            }

            router.push("/login?message=Registration successful! Please login.");
            
        } catch (error) {
            setError(error instanceof Error ? error.message : "Registration failed. Please try again.");
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
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
        watch,
        isLoading,
    };
};
