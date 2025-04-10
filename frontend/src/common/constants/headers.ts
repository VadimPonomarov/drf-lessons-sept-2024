"use server";

import { getRedisData } from "@/services/redis/redisService.ts";
import { headers_CORS } from "@/common/constants/constants.ts";
import { IDummyAuthLoginResponse } from "@/common/interfaces/dummy.interfaces.ts";

export const getAuthorizationHeaders = async () => {
  try {
    const authData = (await getRedisData(
      "dummy_auth",
    )) as unknown as IDummyAuthLoginResponse;

    if (!authData || !authData.accessToken) {
      throw new Error("Access token not found in Redis");
    }

    return {
      ...headers_CORS,
      Authorization: `Bearer ${authData.accessToken}`,
      credentials: "include" as RequestCredentials,
    };
  } catch (error) {
    console.error("Error retrieving access token from Redis:", error);
    throw error;
  }
};

