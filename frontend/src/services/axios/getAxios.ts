import axios from "axios";

export const getAxios = (baseUrl: string) =>
    axios.create({
        baseURL: baseUrl,
        timeout: 1000,
        headers: {
            accept: "application/json"
        },
    });
