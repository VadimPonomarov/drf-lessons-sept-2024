"use client";
import React, {FC, useRef} from "react";
import {FieldErrors, SubmitHandler, UseFormRegister} from "react-hook-form";
import {ResizableWrapper} from "@/components/All/ResizableWrapper/ResizableWrapper";
import FormFieldsRenderer from "@/components/All/FormFieldsRenderer/FormFieldsRenderer";
import {Button} from "@/components/ui/button";
import {ICar} from "@/common/interfaces/cars.interfaces";
import {FormFieldsConfig} from "@/common/interfaces/forms.interfaces.ts";

import css from "./index.module.css";

interface FormComponentProps {
    fields: FormFieldsConfig<ICar>;
    register: UseFormRegister<ICar>;
    errors: FieldErrors<ICar>;
    item: ICar | null;
    handleSubmit: (onSubmit: SubmitHandler<ICar>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmit: SubmitHandler<ICar>;
    handleReset: (ref: React.RefObject<HTMLFormElement>) => void;
    isValid: boolean;
}

const FormComponent: FC<FormComponentProps> = ({
                                                   fields,
                                                   register,
                                                   errors,
                                                   item,
                                                   handleSubmit,
                                                   onSubmit,
                                                   handleReset,
                                                   isValid
                                               }) => {
    const ref = useRef<HTMLFormElement>(null);

    return (
        <div className={css.container}>
            <ResizableWrapper>
                <form
                    ref={ref}
                    onSubmit={handleSubmit(onSubmit)}
                    className={css.form}
                >
                    <FormFieldsRenderer
                        fields={fields}
                        register={register}
                        errors={errors}
                        item={item}
                    />
                    <div className={css.buttonGroup}>
                        <Button size={"sm"} type="submit" disabled={!isValid}>
                            {item?.id ? "Edit" : "Create"}
                        </Button>
                        <Button size={"sm"} type="button" onClick={() => handleReset(ref)}>
                            Reset
                        </Button>
                    </div>
                </form>
            </ResizableWrapper>
        </div>
    );
};

export default FormComponent;
