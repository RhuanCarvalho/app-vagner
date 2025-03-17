import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export const Container = ({
    children,
    className
}: ContainerProps) => {
    return (
        <div className="h-full flex justify-center items-center">
            <div className={twMerge("h-full w-full sm:max-w-lg", className)}>
                {children}
            </div>
        </div>
    )
}