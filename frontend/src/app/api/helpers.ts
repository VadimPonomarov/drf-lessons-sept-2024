"use server";

import { baseUrl } from "@/common/constants/constants.ts";
import {
  IDummyAuth,
  IDummyAuthLoginResponse,
} from "@/common/interfaces/dummy.interfaces.ts";
import { getAuthorizationHeaders } from "@/common/constants/headers.ts";
import { redirect } from "next/navigation";
import { getRedisData, setRedisData } from "@/services/redis/redisService.ts";

// Centralized error handler
const handleFetchErrors = async (response: Response, requestUrl?: string) => {
  if (!response.ok) {
    const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    console.error(errorMessage);

    switch (response.status) {
      case 401:
        console.log("Error 401: Token not valid. Redirecting to refresh...");
        await fetchRefresh();
        redirect(requestUrl || "/");
        break;

      case 403:
        console.log("Error 403: Access denied. Redirecting...");
        redirect("/login");
        break;

      case 404:
        console.log("Error 404: Resource not found. Redirecting...");
        redirect("/error");
        break;

      case 500:
        console.log("Error 500: Internal server error. Redirecting...");
        redirect("/error");
        break;

      default:
        console.log(`Error ${response.status} occurred. Redirecting...`);
        redirect("/error");
        break;
    }

    return null; // Ensure the method returns a graceful fallback
  }

  return response.json(); // Returns the parsed response body
};

// General function for executing requests
const fetchData = async (
  endpoint: string,
  callbackUrl?: string,
  params?: Record<string, string>,
) => {
  const urlSearchParams = new URLSearchParams(params).toString();
  const headers = await getAuthorizationHeaders();

  try {
    const response = await fetch(`${baseUrl}${endpoint}?${urlSearchParams}`, {
      headers,
      method: "GET",
    });
    return await handleFetchErrors(response, callbackUrl || "/");
  } catch (error) {
    console.error("Error executing request:", error.toString());
    return null; // Avoid throwing errors and gracefully return null
  }
};

// Function for authentication
export const fetchAuth = async (credentials: IDummyAuth, path?: string) => {
  try {
    const response = await fetch(path || `${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    return await handleFetchErrors(response);
  } catch (error) {
    console.error("Authentication error:", error.toString());
    return null; // Graceful fallback
  }
};

// Function for refreshing tokens
export const fetchRefresh = async (
  key: string = "dummy_auth",
): Promise<void> => {
  try {
    const redisData = (await getRedisData(
      key,
    )) as unknown as IDummyAuthLoginResponse;

    const { refreshToken } = redisData || {};
    if (!refreshToken) {
      console.error(
        "Refresh token not found in Redis. Redirecting to login...",
      );

      return redirect("/login");
    }

    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`Failed to refresh token. Status: ${response.status}`);
      return redirect("/login");
    }

    const updatedData = await response.json();
    await setRedisData(key, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error during token refresh:", error.toString());
    redirect("/login");
  }
};

// Helper functions for various requests
export const fetchUsers = async (params?: Record<string, string>) => {
  return fetchData("/auth/users", "/users", params);
};

export const fetchUserById = async (id: string) => {
  return fetchData(`/auth/users/${id}`);
};

export const fetchRecipes = async (params?: Record<string, string>) => {
  return fetchData("/auth/recipes", "/recipes", params);
};

export const fetchRecipeById = async (id: string) => {
  return fetchData(`/auth/recipes/${id}`);
};

export const fetchRecipesByTag = async (name: string) => {
  return fetchData(`/recipes/tag/${name}`);
};
