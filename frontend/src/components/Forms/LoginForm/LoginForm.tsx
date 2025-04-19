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
import { AuthProvider, authProviderOptions, IBackendAuth } from "@/common/interfaces/auth.interfaces";
import { IDummyAuth } from "@/common/interfaces/dummy.interfaces";
import { useLoginForm, dummyFormFields, backendFormFields } from "./useLoginForm";

const LoginForm: FC = () => {
    const {
        dummyForm,
        backendForm,
        error,
        authProvider,
        setAuthProvider,
        onSubmit,
    } = useLoginForm();

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

    return (
        <div className={"container-flex"}>
            <ResizableWrapper>
                <h1 className="text-2xl font-bold mb-6">Login</h1>
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

                {authProvider === AuthProvider.Dummy && (
                    <form onSubmit={dummyForm.handleSubmit(onSubmit)} className="form">
                        <div className="mt-4">
                            <UsersComboBox reset={dummyForm.reset} />
                            <FormFieldsRenderer<IDummyAuth>
                                fields={dummyFormFields}
                                register={dummyForm.register}
                                errors={dummyForm.formState.errors}
                            />
                        </div>
                        {renderFormButtons(dummyForm.formState.isValid, dummyForm.reset)}
                    </form>
                )}

                {authProvider === AuthProvider.MyBackendDocs && (
                    <form onSubmit={backendForm.handleSubmit(onSubmit)} className="form">
                        <div className="mt-4">
                            <FormFieldsRenderer<IBackendAuth>
                                fields={backendFormFields}
                                register={backendForm.register}
                                errors={backendForm.formState.errors}
                            />
                        </div>
                        {renderFormButtons(backendForm.formState.isValid, backendForm.reset)}
                    </form>
                )}

                {error && <div className="text-red-500 text-sm">{error}</div>}
            </ResizableWrapper>
        </div>
    );
};

const renderFormButtons = (isValid: boolean, reset: () => void) => (
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
            onClick={() => reset()}
        >
            <ArrowPathIcon className="h-5 w-5" />
        </Button>
    </ButtonGroup>
);

export default LoginForm;

