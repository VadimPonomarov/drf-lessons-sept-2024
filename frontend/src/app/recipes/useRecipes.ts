"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { IRecipe, IRecipesResponse } from "@/common/interfaces/recipe.interfaces";
import { filterItems } from "@/services/filters/filterServices";

interface IProps {
    initialData: IRecipesResponse | Error;
}

export const useRecipes = ({ initialData }: IProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const limit = Number(searchParams.get("limit")) || 30;
    const skip = Number(searchParams.get("skip")) || 0;
    const total = initialData instanceof Error ? 0 : Number(initialData.total);
    const [uniqueRecipes, setUniqueRecipes] = useState<IRecipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[]>([]);

    useEffect(() => {
        if (initialData instanceof Error) {
            signOut({ callbackUrl: "/api/auth" });
        }
    }, [initialData]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<IRecipesResponse>({
        queryKey: ["recipes", skip, limit],
        queryFn: async ({ pageParam = skip }) =>
            await fetch(`/api/recipes?${new URLSearchParams({ limit: String(limit), skip: String(pageParam) })}`).then(res => res.json()),
        getNextPageParam: (lastPage, allPages) => {
            const newSkip = allPages.reduce((acc, page) => acc + (page?.recipes?.length || 0), 0);
            return newSkip < total ? newSkip : undefined;
        },
        initialPageParam: skip,
        initialData: initialData instanceof Error ? undefined : { pages: [initialData], pageParams: [skip] },
        staleTime: Infinity,
    });

    useEffect(() => {
        const allRecipes = data?.pages.flatMap((page) => page.recipes) || [];
        const validRecipes = allRecipes.filter(recipe => recipe && recipe.id);
        const uniqueRecipes = Array.from(new Set(validRecipes.map(recipe => recipe.id))).map(id => {
            return validRecipes.find(recipe => recipe.id === id);
        });
        setUniqueRecipes(uniqueRecipes);
        setFilteredRecipes(uniqueRecipes);
    }, [data, skip, limit]);

    useEffect(() => {
        if (skip === 0) {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        }
    }, [skip, limit, queryClient]);

    // Синхронизация значений пагинатора с параметрами командной строки и ререндеринг содержимого страницы при их изменении
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("skip", String(skip));
        newParams.set("limit", String(limit));
        router.replace(`?${newParams.toString()}`);
    }, [skip, limit, searchParams, router]);

    // Перезагрузка данных при изменении параметров
    useEffect(() => {
        if (data) {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        }
    }, [data, skip, limit, queryClient]);

    const handleNextPage = () => {
        fetchNextPage();
    };

    const filterRecipes = useCallback((inputValues: { [key in keyof IRecipe]?: string }) => {
        setFilteredRecipes(filterItems(uniqueRecipes, inputValues));
    }, [uniqueRecipes]);

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
