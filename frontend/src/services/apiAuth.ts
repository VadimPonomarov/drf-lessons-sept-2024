import {getAxios} from "@/services/axios/getAxios.ts";
import {IDummyAuth, IDummyAuthLoginResponse} from "@/common/interfaces/dummy.interfaces.ts";

const apiAuth = getAxios("https://dummyjson.com")
export const apiAuthService = {
    login: async (credentials: IDummyAuth): Promise<IDummyAuthLoginResponse> => {
        try {
            const response = await apiAuth.post<IDummyAuthLoginResponse>(
                "/auth/login",
                credentials,
                {withCredentials: true, withXSRFToken: true}
            );
            return response.data
        } catch (e) {
            console.log(e);
        }
    },
};
