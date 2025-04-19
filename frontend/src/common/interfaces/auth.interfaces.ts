export interface IBackendAuth {
    email: string;
    password: string;
}

export enum AuthProvider {
    Select = "Select ...",
    Dummy = "Dummy",
    MyBackendDocs = "MyBackendDocs"
}

export interface IAuthProviderOption {
    value: AuthProvider;
    label: string;
}

export const authProviderOptions: IAuthProviderOption[] = [
    { value: AuthProvider.Dummy, label: "Dummy Auth" },
    { value: AuthProvider.MyBackendDocs, label: "My Backend Docs" }
];

export interface IRegistration {
    email: string;
    password: string;
    confirmPassword: string;
}
