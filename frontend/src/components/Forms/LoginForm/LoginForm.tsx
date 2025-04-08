"use client";
import React, { FC } from "react";
import { ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/react/16/solid";

import { ResizableWrapper } from "@/components/All/ResizableWrapper/ResizableWrapper";
import FormFieldsRenderer from "@/components/All/FormFieldsRenderer/FormFieldsRenderer";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/All/ButtonGroup/ButtonGroup.tsx";
import UsersComboBox from "@/app/users/(details)/UsersComboBox/UsersComboBox.tsx";
import { useLoginForm, formFields } from "./useLoginForm";

const LoginForm: FC = () => {
    const {
        register,
        handleSubmit,
        errors,
        isValid,
        reset,
        onSubmit,
        error,
        defaultValues,
    } = useLoginForm();

    return (
        <div className={"container-flex"}>
            <ResizableWrapper>
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <UsersComboBox reset={reset} />
                    <FormFieldsRenderer fields={formFields} register={register} errors={errors} />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <ButtonGroup orientation="horizontal">
                        <Button variant={"outline"} type="submit" disabled={!isValid}>
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </Button>
                        <Button variant={"outline"} type="button" onClick={() => reset(defaultValues)}>
                            <ArrowPathIcon className="h-5 w-5" />
                        </Button>
                    </ButtonGroup>
                </form>
            </ResizableWrapper>
        </div>
    );
};

export default LoginForm;

