"use client"
import React, {FC, useRef} from "react";

import css from "./index.module.css";

export const ResizableWrapper: FC<{ children: React.ReactNode }> = ({
                                                                        children,
                                                                    }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const startY = e.clientY;
        const startHeight = wrapperRef.current?.offsetHeight || 0;
        const startX = e.clientX;
        const startWidth = wrapperRef.current?.offsetWidth || 0;

        const onMouseMove = (e: MouseEvent) => {
            if (wrapperRef.current) {
                const newHeight = startHeight + (e.clientY - startY);
                const newWidth = startWidth + (e.clientX - startX);
                wrapperRef.current.style.height = `${newHeight}px`;
                wrapperRef.current.style.width = `${newWidth}px`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div className={css.resizableWrapper} ref={wrapperRef}>
            {children}
            <div className={css.resizer} onMouseDown={handleMouseDown}></div>
        </div>
    );
};
