import { getAxios } from "@/services/axios/getAxios";
import { IRegistration } from "@/common/interfaces/auth.interfaces";
import { IUser } from "@/common/interfaces/users.interfaces";
import { AxiosError } from "axios";

const apiAuth = getAxios("/api/auth");

interface IRegistrationResponse {
    user: IUser;
    message: string;
}

interface ApiErrorResponse {
    error_code: string;
    error_message: string;
    details?: string;
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const apiAuthService = {
    register: async (data: Pick<IRegistration, 'email' | 'password'>): Promise<IRegistrationResponse> => {
        try {
            const response = await apiAuth.post<IRegistrationResponse>("/register", data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorData = error.response?.data as ApiErrorResponse;
                throw new ApiError(errorData?.error_message || "Registration failed");
            }
            throw new ApiError("An unexpected error occurred");
        }
    },
};