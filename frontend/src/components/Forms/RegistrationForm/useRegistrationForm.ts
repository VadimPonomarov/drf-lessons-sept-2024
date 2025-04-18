"use client";

import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IRegistration } from "@/common/interfaces/auth.interfaces";
import { FormFieldsConfig } from "@/common/interfaces/forms.interfaces";

import { schema } from "./index.joi";

export const formFields: FormFieldsConfig<IRegistration> = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

export const useRegistrationForm = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const defaultValues: IRegistration = {
        email: "",
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
            const registrationData = {
                email: data.email,
                password: data.password
            };
            
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationData),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            router.push("/login");
        } catch (error) {
            console.error("Error during registration:", error);
            setError("Registration failed. Please try again.");
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
    };
};