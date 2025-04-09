import React from "react";
import FormField from "@/components/All/FormField/FormField.tsx";

import { FormFieldsRendererProps } from ".";

const FormFieldsRenderer = <T,>({ fields, register, errors, item }: FormFieldsRendererProps<T>) => (
    <>
        {fields.map((field) => {
            if (field.condition && !field.condition(item)) {
                return null;
            }
            return (
                <FormField
                    key={String(field.name)}
                    name={field.name}
                    label={field.label}
                    register={register}
                    errors={errors}
                    type={field.type}
                />
            );
        })}
    </>
);

export default FormFieldsRenderer;

