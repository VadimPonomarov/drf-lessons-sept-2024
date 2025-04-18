import { ReactNode } from "react";

export interface IMenuItem {
    path: string;
    label: string | ReactNode;
    disabled?: boolean;
    cb?: () => void;
}

export interface IProps {
    children?: React.ReactNode;
    items: IMenuItem[];
    className?: string;
}
