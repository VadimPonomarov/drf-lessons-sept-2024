"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { IProps } from "./interfaces";

export const usePaginationComponent = ({ total, baseUrl }: IProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams.get("skip")) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("skip", "0");
      newParams.set("limit", searchParams.get("limit") || "30");
      router.replace(`${baseUrl}?${newParams.toString()}`);
    }
  }, [searchParams, router, baseUrl]);

  const setNext = () => {
    const newSkip = (
        Number(searchParams.get("skip") || "0") + Number(searchParams.get("limit") || "30")
    ).toString();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("skip", newSkip);
    newParams.set("limit", searchParams.get("limit") || "30");
    router.replace(`${baseUrl}?${newParams.toString()}`);
  };

  const setPrev = () => {
    const newSkip = (
        Number(searchParams.get("skip") || "0") - Number(searchParams.get("limit") || "30")
    ).toString();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("skip", newSkip);
    newParams.set("limit", searchParams.get("limit") || "30");
    router.replace(`${baseUrl}?${newParams.toString()}`);
  };

  const currentPage = Math.floor(Number(searchParams.get("skip")) / Number(searchParams.get("limit"))) + 1 || 1;
  const hasNextPage = (total - Number(searchParams.get("skip"))) / Number(searchParams.get("limit")) > 1;
  const hasPrevPage = Number(searchParams.get("skip")) >= Number(searchParams.get("limit"));

  return {
    setNext,
    setPrev,
    currentPage,
    hasNextPage,
    hasPrevPage,
  };
};
