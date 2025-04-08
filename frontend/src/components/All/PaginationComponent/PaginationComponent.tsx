"use client";
import { FC } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import SearchParamSkipSelector from "@/components/All/SearchParamSkipSelector/SearchParamSkipSelector.tsx";
import SearchParamLimitSelector from "@/components/All/SearchParamLimitSelector/SearchParamLimitSelector.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import styles from "./index.module.css";
import { usePaginationComponent } from "./usePaginationComponent";
import { IProps } from "./interfaces";

export const PaginationComponent: FC<IProps> = ({ total, baseUrl }) => {
  const { setNext, setPrev, currentPage, hasNextPage, hasPrevPage } = usePaginationComponent({ total, baseUrl });

  return (
      <>
        <Pagination>
          <PaginationContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <SearchParamSkipSelector />
                </TooltipTrigger>
                <TooltipContent side="top" className={styles.tooltipContent}>
                  <p>Skip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {hasPrevPage && (
                <PaginationItem onClick={setPrev} style={{ cursor: "pointer" }}>
                  <PaginationPrevious />
                </PaginationItem>
            )}
            <PaginationItem style={{ cursor: "pointer" }}>
              <PaginationLink>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem style={{ cursor: "pointer" }}>
              <PaginationEllipsis />
            </PaginationItem>
            {hasNextPage && (
                <PaginationItem onClick={setNext} style={{ cursor: "pointer" }}>
                  <PaginationNext />
                </PaginationItem>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <SearchParamLimitSelector />
                </TooltipTrigger>
                <TooltipContent side="top" className={styles.tooltipContent}>
                  <p>Limit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </PaginationContent>
        </Pagination>
      </>
  );
};


