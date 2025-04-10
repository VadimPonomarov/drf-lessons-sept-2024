"use server";
import { getRedisData } from "@/services/redis/redisService.ts";
import { headers_CORS } from "@/common/constants/constants.ts";

export const getAuthorizationHeaders = async () => {
  try {
    // Retrieve the accessToken directly from Redis
    const accessToken = await getRedisData("accessToken");

    if (!accessToken) {
      throw new Error("Access token not found in Redis");
    }

    return {
      ...headers_CORS,
      Authorization: `Bearer ${accessToken}`,
      credentials: "include" as RequestCredentials,
      cache: "force-cache" as RequestCache,
    };
  } catch (error) {
    console.error("Error retrieving access token from Redis:", error);
    throw error;
  }
};