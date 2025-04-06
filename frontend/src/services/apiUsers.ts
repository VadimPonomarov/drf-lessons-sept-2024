import {IUsersResponse} from "@/common/interfaces/users.interfaces.ts";
import {baseUrl} from "@/common/constants/constants.ts";
import {getAxios} from "@/services/axios/getAxios.ts";

const api = getAxios(baseUrl);
export const apiUsers = {
    usersAll: async (): Promise<IUsersResponse> => {
        try {
            const response = await api.get("/users", {
                params: {limit: "0"}
            });
            return await response.data;
        } catch (e) {
            console.error(e);
        }
    },
};
