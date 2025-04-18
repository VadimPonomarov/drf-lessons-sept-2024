"use client";
import React, { FC } from "react";
import { ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { ResizableWrapper } from "@/components/All/ResizableWrapper/ResizableWrapper";
import FormFieldsRenderer from "@/components/All/FormFieldsRenderer/FormFieldsRenderer";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/All/ButtonGroup/ButtonGroup";
import UsersComboBox from "@/app/users/(details)/UsersComboBox/UsersComboBox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AuthProvider, authProviderOptions } from "@/common/interfaces/auth.interfaces";
import { useAuthProviderContext } from "@/contexts/AuthProviderContext.tsx";

import { useLoginForm, formFields } from "./useLoginForm";

const LoginForm: FC = () => {
    const { authProvider, setAuthProvider } = useAuthProviderContext();
    
    const handleAuthProviderChange = async (value: AuthProvider) => {
        setAuthProvider(value);
        try {
            await fetch("/api/redis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: "auth_provider",
                    value: value
                }),
            });
        } catch (error) {
            console.error("Error saving auth provider to Redis:", error);
        }
    };

    const {
        register,
        handleSubmit,
        errors,
        isValid,
        onSubmit,
        error,
        reset,
        defaultValues
    } = useLoginForm();

    return (
        <div className={"container-flex"}>
            <ResizableWrapper>
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <Select
                        value={authProvider}
                        onValueChange={(value) => handleAuthProviderChange(value as AuthProvider)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Make your choice first..." />
                        </SelectTrigger>
                        <SelectContent>
                            {authProviderOptions.map((option) => (
                                <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {authProvider !== AuthProvider.Select && (
                        <>
                            {authProvider === AuthProvider.Dummy && (
                                <div className="mt-4">
                                    <UsersComboBox reset={reset} />
                                    <FormFieldsRenderer 
                                        fields={formFields} 
                                        register={register} 
                                        errors={errors} 
                                    />
                                    {error && <div className="text-red-500 text-sm">{error}</div>}
                                    <ButtonGroup orientation="horizontal">
                                        <Button 
                                            variant={"ghost"} 
                                            type="submit" 
                                            disabled={!isValid}
                                        >
                                            <PaperAirplaneIcon className="h-5 w-5" />
                                        </Button>
                                        <Button 
                                            variant={"ghost"} 
                                            type="button" 
                                            onClick={() => reset(defaultValues)}
                                        >
                                            <ArrowPathIcon className="h-5 w-5" />
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            )}
                        </>
                    )}
                </form>
            </ResizableWrapper>
        </div>
    );
};

export default LoginForm;

