"use client";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useInfiniteQuery} from "@tanstack/react-query";
import {signOut} from "next-auth/react";
import {IRecipe, IRecipesResponse} from "@/common/interfaces/recipe.interfaces";
import {filterItems} from "@/services/filters/filterServices";

interface IProps {
    initialData: IRecipesResponse | Error;
}

export const useRecipes = ({initialData}: IProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const limit = useMemo(() => {
        const paramValue = searchParams.get("limit");
        return paramValue !== null ? Number(paramValue) : 30;
    }, [searchParams]);

    const skip = useMemo(() => {
        const paramValue = searchParams.get("skip");
        return paramValue !== null ? Number(paramValue) : 0;
    }, [searchParams]);

    const total = initialData instanceof Error ? 0 : Number(initialData.total);

    const [uniqueRecipes, setUniqueRecipes] = useState<IRecipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[]>([]);

    useEffect(() => {
        if (initialData instanceof Error) {
            signOut({callbackUrl: "/api/auth"});
        }
    }, [initialData]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<IRecipesResponse>({
        queryKey: ["recipes", skip, limit],
        queryFn: async ({pageParam = skip}) =>
            await fetch(`/api/recipes?${new URLSearchParams({
                limit: String(limit),
                skip: String(pageParam)
            })}`).then((res) => res.json()),
        getNextPageParam: (lastPage, allPages) => {
            const newSkip = allPages.reduce((acc, page) => acc + (page?.recipes?.length || 0), 0);
            return newSkip < total ? newSkip : undefined;
        },
        initialPageParam: skip,
        initialData: initialData instanceof Error ? undefined : {pages: [initialData], pageParams: [skip]},
        staleTime: Infinity,
    });

    // Синхронизация данных с отображаемым рендером
    useEffect(() => {
        if (data) {
            const allRecipes = data.pages.flatMap((page) => page.recipes || []);
            // Если limit=0, берем все элементы от skip до конца
            const startIndex = skip;
            const endIndex = limit > 0 ? skip + limit : allRecipes.length;
            const visibleRecipes = allRecipes.slice(startIndex, endIndex);

            const validRecipes = visibleRecipes.filter(recipe => recipe && recipe.id);
            const uniqueRecipes = Array.from(new Set(validRecipes.map(recipe => recipe.id)))
                .map(id => validRecipes.find(recipe => recipe.id === id));

            setUniqueRecipes(uniqueRecipes as IRecipe[]);
            setFilteredRecipes(uniqueRecipes as IRecipe[]);
        }
    }, [data, skip, limit]);

    // Синхронизация URL с параметрами
    useEffect(() => {
        const currentSkip = searchParams.get("skip") || "0";
        const currentLimit = searchParams.get("limit") || "30";

        if (currentSkip !== String(skip) || currentLimit !== String(limit)) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("skip", String(skip));
            newParams.set("limit", String(limit));
            router.replace(`?${newParams.toString()}`);
        }
    }, [skip, limit, searchParams, router]);

    const handleNextPage = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const filterRecipes = useCallback(
        (inputValues: { [key in keyof IRecipe]?: string }) => {
            const filtered = filterItems(uniqueRecipes, inputValues);
            setFilteredRecipes(filtered);
        },
        [uniqueRecipes]
    );

    return {
        uniqueRecipes,
        filteredRecipes: useMemo(() => filteredRecipes, [filteredRecipes]),
        handleNextPage,
        isFetchingNextPage,
        hasNextPage,
        total,
        filterRecipes,
    };
};

