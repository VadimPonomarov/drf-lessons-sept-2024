"use client";

import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IDummyAuth,
} from "@/common/interfaces/dummy.interfaces";
import { 
  IBackendAuth,
  AuthProvider 
} from "@/common/interfaces/auth.interfaces";
import { FormFieldsConfig } from "@/common/interfaces/forms.interfaces";
import { fetchAuth } from "@/app/api/helpers";
import { dummySchema, backendSchema } from "./index.joi";

type LoginFormData = IDummyAuth | IBackendAuth;

export const dummyFormFields: FormFieldsConfig<IDummyAuth> = [
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "expiresInMins", label: "Expires in Minutes", type: "number" },
];

export const backendFormFields: FormFieldsConfig<IBackendAuth> = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];

export const useLoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [authProvider, setAuthProvider] = useState<AuthProvider>(AuthProvider.Dummy);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/users";

  const schema = authProvider === AuthProvider.MyBackendDocs ? backendSchema : dummySchema;
  const defaultValues: LoginFormData = authProvider === AuthProvider.MyBackendDocs 
    ? { email: "", password: "" } as IBackendAuth
    : { username: "", password: "", expiresInMins: 30 } as IDummyAuth;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: joiResolver(schema),
    defaultValues,
    mode: "all",
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      if (authProvider === AuthProvider.MyBackendDocs) {
        const backendData = data as IBackendAuth;
        const response = await fetchAuth(backendData);
        if (!response) {
          throw new Error("Login failed");
        }
        // Store backend auth response
        await fetch("/api/redis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "backend_auth",
            value: response,
          }),
        });
      } else {
        const dummyData = data as IDummyAuth;
        const response = await fetchAuth(dummyData);
        if (!response) {
          throw new Error("Login failed");
        }
        // Store dummy auth response
        await fetch("/api/redis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "dummy_auth",
            value: response,
          }),
        });
      }
      router.push(callbackUrl);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    reset,
    onSubmit,
    error,
    setError,
    defaultValues,
    authProvider,
  };
};