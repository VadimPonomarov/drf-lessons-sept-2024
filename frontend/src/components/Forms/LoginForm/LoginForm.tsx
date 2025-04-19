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
import { useAuthProviderContext } from "@/contexts/AuthProviderContext";

import { useLoginForm, dummyFormFields, backendFormFields } from "./useLoginForm";

const LoginForm: FC = () => {
    const {
        dummyForm,
        backendForm,
        error,
        authProvider,
        setAuthProvider: setLocalAuthProvider,
        onSubmit,
    } = useLoginForm();
    const { setAuthProvider } = useAuthProviderContext();

    const handleAuthProviderChange = async (value: AuthProvider) => {
        console.log('Changing auth provider to:', value);
        setLocalAuthProvider(value);
        await setAuthProvider(value);
    };

    return (
        <div className={"container-flex"}>
            <ResizableWrapper>
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <Select
                    value={authProvider === AuthProvider.Select ? undefined : authProvider}
                    onValueChange={(value) => handleAuthProviderChange(value as AuthProvider)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select ..." />
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

