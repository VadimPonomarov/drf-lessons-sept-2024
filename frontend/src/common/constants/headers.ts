"use server";

import { getRedisData } from "@/services/redis/redisService.ts";
import { headers_CORS } from "@/common/constants/constants.ts";
import { IDummyAuthLoginResponse } from "@/common/interfaces/dummy.interfaces.ts";
import { redirect } from "next/navigation";

export const getAuthorizationHeaders = async () => {
  try {
    const authData = (await getRedisData(
      "dummy_auth",
    )) as unknown as IDummyAuthLoginResponse;

    if (!authData || !authData.accessToken) {
      return redirect("/login");
    }

    return {
      ...headers_CORS,
      Authorization: `Bearer ${authData.accessToken}`,
      credentials: "include" as RequestCredentials,
    };
  } catch (error) {
    throw error;
  }
};
