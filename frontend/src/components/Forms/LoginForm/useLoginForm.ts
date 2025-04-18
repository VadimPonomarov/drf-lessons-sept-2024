"use client";

import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IDummyAuth,
  IDummyAuthLoginResponse,
} from "@/common/interfaces/dummy.interfaces";
import { FormFieldsConfig } from "@/common/interfaces/forms.interfaces";
import { AuthProvider } from "@/common/interfaces/auth.interfaces";
import { fetchAuth } from "@/app/api/helpers";

import { schema } from "./index.joi";

export const formFields: FormFieldsConfig<IDummyAuth> = [
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "expiresInMins", label: "Expires in Minutes", type: "number" },
];

export const useLoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [authProvider, setAuthProvider] = useState<AuthProvider>(AuthProvider.Dummy);
  
  const defaultValues: IDummyAuth = {
    username: "",
    password: "",
    expiresInMins: null,
  };
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/users";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IDummyAuth>({
    resolver: joiResolver(schema),
    defaultValues,
    mode: "all",
  });

  const onSubmit: SubmitHandler<IDummyAuth> = async (data) => {
    if (authProvider === AuthProvider.MyBackendDocs) {
      return; // No action for MyBackendDocs
    }

    try {
      const response = (await fetchAuth(data)) as IDummyAuthLoginResponse;

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
    setAuthProvider,
  };
};
