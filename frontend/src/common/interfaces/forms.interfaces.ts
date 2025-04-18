import { FieldErrors, UseFormRegister, Path } from "react-hook-form";

export interface FormFieldConfig<T> extends React.InputHTMLAttributes<HTMLInputElement> {
    name: Path<T>;
    label?: string;
    type: 'text' | 'password' | 'number' | 'email';
    condition?: (item: T | null) => boolean;
    readOnly?: boolean;
}

export type FormFieldsConfig<T> = FormFieldConfig<T>[];

export interface FormFieldProps<T> {
    name: Path<T>;
    label?: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    type?: 'text' | 'password' | 'number' | 'email';
}


