import React from "react";

import {Input} from "@/components/ui/input";
import {FormFieldProps} from "@/common/interfaces/forms.interfaces.ts";
import css from "./index.module.css";


const FormField = <T, >({name, label, register, errors, type = "text"}: FormFieldProps<T>) => {
    const errorMessage = errors[name as unknown as keyof T]?.message as string;

    return (
        <div className={css.formGroup}>
            <label htmlFor={String(name)}>{label}</label>
            <Input {...register(name)} id={String(name)} type={type}/>
            {errorMessage && (
                <small className={css.error}>{errorMessage}</small>
            )}
        </div>
    );
};

export default FormField

