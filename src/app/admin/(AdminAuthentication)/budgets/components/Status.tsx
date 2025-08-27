import { twMerge } from "tailwind-merge";

export type StatusType = "Pendente" | "Respondido" | "Cancelado";

interface StatusProps {
    nameStatus: StatusType;
}

export const Status = ({ nameStatus }: StatusProps) => {
    const selectStatus: Record<StatusType, string> = {
        Pendente: "bg-yellow-200 text-yellow-900",
        Respondido: "bg-green-200 text-green-900",
        Cancelado: "bg-red-200 text-red-900",
    };

    return (
        <p className={twMerge(`text-[14px] py-1 px-2 rounded-lg font-bold`,selectStatus[nameStatus])}>
            {nameStatus}
        </p>
    );
};
