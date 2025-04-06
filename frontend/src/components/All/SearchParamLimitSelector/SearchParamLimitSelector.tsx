"use client";
import {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const SearchParamLimitSelector = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [inputValue, setInputValue] = useState(searchParams.get("limit") || "30");
    const pathName = usePathname();

    const handleLimitChange = (value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("limit", value);
        router.replace(`${pathName}?${newParams.toString()}`);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setInputValue(event.target.value);
        handleLimitChange(event.target.value);
    };

    const handleReset = () => {
        setInputValue("30");
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("limit", "30");
        router.replace(`${pathName}?${newParams.toString()}`);
    };

    useEffect(() => {
        const handleParamsChange = () => {
            const limit = searchParams.get("limit");
            setInputValue(limit !== null ? limit : "30");
        };

        handleParamsChange();
        window.addEventListener("popstate", handleParamsChange);

        return () => {
            window.removeEventListener("popstate", handleParamsChange);
        };
    }, [searchParams]);

    useEffect(() => {
        const limit = searchParams.get("limit");
        setInputValue(limit !== null ? limit : "30");
    }, [searchParams]);

    return (
        <div className="flex items-center gap-2">
            <span onClick={handleReset} className="text-xs">💥</span>
            <select value={inputValue} onChange={handleSelectChange}
                    className="w-[70px] border-none text-xs focus:border-none">
                <option value="0">All</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
            </select>
        </div>
    );
};

export default SearchParamLimitSelector;









