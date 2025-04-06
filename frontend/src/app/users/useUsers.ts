"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { IUser, IUsersResponse } from "@/common/interfaces/users.interfaces";
import { filterItems } from "@/services/filters/filterServices";

interface IProps {
    initialData: IUsersResponse;
}

export const useUsers = ({ initialData }: IProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const limit =
        searchParams.get("limit") !== null
            ? Number(searchParams.get("limit"))
            : 30;
    const skip = Number(searchParams.get("skip")) || 0;
    const total = initialData instanceof Error ? 0 : Number(initialData.total);
    const [uniqueUsers, setUniqueUsers] = useState<IUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const [filterParams, setFilterParams] = useState<{ [key in keyof IUser]?: string }>({});

    useEffect(() => {
        if (initialData instanceof Error) {
            signOut({ callbackUrl: "/api/auth" });
        }
    }, [initialData]);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<IUsersResponse, Error>({
        queryKey: ["users", limit, skip],
        queryFn: async ({ pageParam = skip }) =>
            await fetch(
                `/api/users?${new URLSearchParams({
                    limit: String(limit),
                    skip: String(pageParam),
                })}`
            ).then((res) => res.json()),
        getNextPageParam: (lastPage, allPages) => {
            const newSkip = allPages.reduce(
                (acc, page) => acc + (page?.users?.length || 0),
                0
            );
            return newSkip < total ? newSkip : undefined;
        },
        initialPageParam: skip,
        initialData:
            initialData instanceof Error
                ? undefined
                : { pages: [initialData], pageParams: [skip] },
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data) {
            const allUsers = data.pages.flatMap((page) => page.users || []);
            const validUsers = allUsers.filter((user) => user && user.id);
            const uniqueUsers = Array.from(
                new Set(validUsers.map((user) => String(user.id)))
            )
                .map((id) => validUsers.find((user) => String(user.id) === id))
                .filter((user) => user !== undefined);

            setUniqueUsers(uniqueUsers as IUser[]);
            setFilteredUsers(
                filterItems(uniqueUsers as IUser[], filterParams) // С учетом текущих фильтров
            );
        }
    }, [data, filterParams]);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
    }, [skip, limit, queryClient]);

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("skip", String(skip));
        newParams.set("limit", String(limit));
        router.replace(`?${newParams.toString()}`);
    }, [skip, limit, searchParams, router]);

    const handleNextPage = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const filterUsers = useCallback(
        (inputValues: { [key in keyof IUser]?: string }) => {
            setFilterParams(inputValues); // Обновляем параметры фильтрации
        },
        []
    );

    return {
        uniqueUsers,
        filteredUsers: useMemo(() => filteredUsers, [filteredUsers]),
        error,
        handleNextPage,
        isFetchingNextPage,
        hasNextPage,
        total,
        filterUsers,
    };
};

