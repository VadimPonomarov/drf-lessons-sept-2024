import { redirect } from "next/navigation";

import { baseUrl, getAuthorizationHeaders } from "@/common/constants/constants.ts";

async function fetchData(endpoint: string, params?: Record<string, string>) {
    const urlSearchParams = new URLSearchParams(params).toString();
    const headers = await getAuthorizationHeaders();

    const response = await fetch(`${baseUrl}${endpoint}?${urlSearchParams}`, {
        headers,
        method: 'GET',
    });

    if (!response.ok) {
        console.log(`Error fetching data from ${endpoint}`);
        redirect('/api/auth');
    }

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error('Failed to parse JSON response');
    }

    return data;
}

export async function fetchUsers(params?: Record<string, string>) {
    return fetchData('/auth/users', params);
}

export const fetchUserById = async (id: string) => {
    return fetchData(`/auth/users/${id}`);
}

export async function fetchRecipes(params?: Record<string, string>) {
    return fetchData('/auth/recipes', params);
}

export const fetchRecipeById = async (id: string) => {
    return fetchData(`/auth/recipes/${id}`);
}

export const fetchRecipesByTag = async (name: string) => {
    return fetchData(`/recipes/tag/${name}`);
}
