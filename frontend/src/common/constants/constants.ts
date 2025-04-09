import {getServerSession} from "next-auth/next";
import {authConfig} from "@/configs/auth.ts";
import {IUserSession} from "@/common/interfaces/users.interfaces.ts";

export const baseUrl = process.env.VITE_API_URL || "https://dummyjson.com";
export const baseCarsUrl =
  process.env.VITE_API_URL || "http://185.69.152.209/carsAPI/v1";

export const headers_CORS = {
    'Access-Control-Allow-Origin': 'http://localhost, http://0.0.0.0',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};


export async function getAuthorizationHeaders() {
    const session = await getServerSession(authConfig);
    const accessToken = (session?.user as IUserSession)?.accessToken;

    // if (!accessToken) {
    //     throw new Error('Access token not found');
    // }

    return {
        ...headers_CORS,
        Authorization: `Bearer ${accessToken}`,
        credentials: 'include' as RequestCredentials,
        cache: 'force-cache' as RequestCache,
    };
}
