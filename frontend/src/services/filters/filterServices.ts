"use client";

export const filterItems = <T>(
    items: T[],
    inputValues: { [key in keyof T]?: string }
): T[] => {
    return items.filter(item =>
        Object.keys(inputValues).every(key => {
            const inputValue = inputValues[key as keyof T];
            const itemValue = item[key as keyof T];

            if (typeof itemValue === "number") {
                return Number(inputValue) === itemValue;
            } else {
                return new RegExp(inputValue || "", "i").test(String(itemValue));
            }
        })
    );
};
