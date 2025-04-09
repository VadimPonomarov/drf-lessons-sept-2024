"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound: FC = () => {
  return (
    <div className={"not-found-container"}>
      <div className={"not-found-text"}>
        <h1 className={"not-found-title"}>404</h1>
        <p className={"not-found-description"}>Page Not Found</p>
        <Link href={"/"}>
          <Button className={"not-found-button"}>Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
