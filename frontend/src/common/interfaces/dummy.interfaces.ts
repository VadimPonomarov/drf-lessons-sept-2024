export interface IDummyAuth {
    username: string;
    password: string;
    expiresInMins: 30 | 60;
}

export interface IDummyAuthRefreshBody {
    refreshToken: string;
    expiresInMins: number;
}

export interface IDummyAuthLoginResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
}

export interface IDummyAuthRefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IDummyAuthMeResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;

    [key: string]: unknown;
}
