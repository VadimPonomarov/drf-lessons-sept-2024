"use server";

import {
  baseUrl,
} from "@/common/constants/constants.ts";
import { IDummyAuth } from "@/common/interfaces/dummy.interfaces.ts";
import { getAuthorizationHeaders } from "@/common/constants/headers.ts";

export const fetchAuth = async (credentials: IDummyAuth) => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  return await response.json();
};
const fetchData = async (endpoint: string, params?: Record<string, string>) => {
  const urlSearchParams = new URLSearchParams(params).toString();
  const headers = await getAuthorizationHeaders();

  const response = await fetch(`${baseUrl}${endpoint}?${urlSearchParams}`, {
    headers,
    method: "GET",
  });

  return await response.json();
};

export const fetchUsers = async (params?: Record<string, string>) => {
  return fetchData("/auth/users", params);
};

export const fetchUserById = async (id: string) => {
  return fetchData(`/auth/users/${id}`);
};

export const fetchRecipes = async (params?: Record<string, string>) => {
  return fetchData("/auth/recipes", params);
};

export const fetchRecipeById = async (id: string) => {
  return fetchData(`/auth/recipes/${id}`);
};

export const fetchRecipesByTag = async (name: string) => {
  return fetchData(`/recipes/tag/${name}`);
};
