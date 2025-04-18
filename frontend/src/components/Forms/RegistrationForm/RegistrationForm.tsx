"use client";

import React, { FC } from "react";
import { ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { ResizableWrapper } from "@/components/All/ResizableWrapper/ResizableWrapper";
import FormFieldsRenderer from "@/components/All/FormFieldsRenderer/FormFieldsRenderer";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/All/ButtonGroup/ButtonGroup";

import { useRegistrationForm, formFields } from "./useRegistrationForm";

const RegistrationForm: FC = () => {
    const {
        register,
        handleSubmit,
        errors,
        isValid,
        reset,
        onSubmit,
        error,
        defaultValues,
        watch,
    } = useRegistrationForm();

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");
    const passwordsMatch = password === confirmPassword;

    return (
        <div className="container-flex">
            <ResizableWrapper>
                <h1 className="text-2xl font-bold mb-6">Register</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <FormFieldsRenderer 
                        fields={formFields} 
                        register={register} 
                        errors={errors} 
                    />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    {password && confirmPassword && !passwordsMatch && (
                        <div style={{ color: "red" }}>Passwords do not match</div>
                    )}
                    <ButtonGroup orientation="horizontal">
                        <Button 
                            variant={"outline"} 
                            type="submit" 
                            disabled={!isValid || !passwordsMatch}
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant={"outline"} 
                            type="button" 
                            onClick={() => reset(defaultValues)}
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                        </Button>
                    </ButtonGroup>
                </form>
            </ResizableWrapper>
        </div>
    );
};

export default RegistrationForm;