import React, {useEffect, useState} from "react";

import {IProps} from "./index.interfaces";

const useUniversalFilter = <T>({
                                   cb,
                               }: IProps<T>) => {
    const [inputValues, setInputValues] = useState<{ [key in keyof T]?: string }>({});

    useEffect(() => {
        if (cb) {
            cb(inputValues);
        }
    }, [inputValues]);

    const handleInputChange = (key: keyof T, value: string) => {
        setInputValues(prev => ({...prev, [key]: value}));
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    };

    const handleReset = () => {
        setInputValues({});
    };

    return {
        inputValues,
        handleInputChange,
        handleFocus,
        handleReset
    };
};

export default useUniversalFilter;
