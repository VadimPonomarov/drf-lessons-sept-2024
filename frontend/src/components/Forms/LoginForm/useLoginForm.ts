"use client";

import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IDummyAuth,
  IDummyAuthLoginResponse,
} from "@/common/interfaces/dummy.interfaces";
import { 
  IBackendAuth,
  AuthProvider 
} from "@/common/interfaces/auth.interfaces";
import { FormFieldsConfig } from "@/common/interfaces/forms.interfaces";
import { fetchAuth } from "@/app/api/helpers";
import { dummySchema, backendSchema } from "./index.joi";

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
  const [authProvider, setAuthProvider] = useState<AuthProvider>(AuthProvider.Select);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/users";

  const dummyForm = useForm<IDummyAuth>({
    resolver: joiResolver(dummySchema),
    defaultValues: {
      username: "",
      password: "",
      expiresInMins: 30,
    },
    mode: "all",
  });

  const backendForm = useForm<IBackendAuth>({
    resolver: joiResolver(backendSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (data: IDummyAuth | IBackendAuth) => {
    try {
      const response = await fetchAuth(data);
      if (!response) {
        throw new Error("Login failed");
      }

      const redisKey = authProvider === AuthProvider.MyBackendDocs ? "backend_auth" : "dummy_auth";
      await fetch("/api/redis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: redisKey,
          value: response,
        }),
      });

      router.push(callbackUrl);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return {
    dummyForm,
    backendForm,
    error,
    setError,
    authProvider,
    setAuthProvider,
    onSubmit,
  };
};