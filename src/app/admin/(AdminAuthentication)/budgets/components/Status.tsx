// import { twMerge } from "tailwind-merge";

// export type StatusType = "Pendente" | "Respondido" | "Cancelado";

// interface StatusProps {
//     nameStatus: StatusType;
// }

// export const Status = ({ nameStatus }: StatusProps) => {
//     const selectStatus: Record<StatusType, string> = {
//         Pendente: "bg-yellow-200 text-yellow-900",
//         Respondido: "bg-green-200 text-green-900",
//         Cancelado: "bg-red-200 text-red-900",
//     };

//     return (
//         <p className={twMerge(`text-[14px] py-1 px-2 rounded-lg font-bold`,selectStatus[nameStatus])}>
//             {nameStatus}
//         </p>
//     );
// };

import { twMerge } from "tailwind-merge";

export type StatusType = 
  | "Pendente" 
  | "Aguardando" 
  | "Agendado" 
  | "Finalizado" 
  | "Recusado" 
  | "Aguardando confirmação de nova data";

interface StatusProps {
    nameStatus: StatusType;
}

export const Status = ({ nameStatus }: StatusProps) => {
    const selectStatus: Record<StatusType, string> = {
        "Pendente": "bg-yellow-200 text-yellow-900",
        "Aguardando": "bg-blue-200 text-blue-900",
        "Agendado": "bg-purple-200 text-purple-900",
        "Finalizado": "bg-green-200 text-green-900",
        "Recusado": "bg-red-200 text-red-900",
        "Aguardando confirmação de nova data": "bg-orange-200 text-orange-900",
    };

    // Função para abreviar textos longos se necessário
    const getDisplayText = (status: StatusType): string => {
        if (status === "Aguardando confirmação de nova data") {
            return "Aguardando confirmação de nova data";
        }
        return status;
    };

    return (
        <p 
            className={twMerge(
                "text-[14px] py-1 px-2 rounded-lg font-bold whitespace-nowrap w-max",
                selectStatus[nameStatus]
            )}
            title={nameStatus} // Tooltip com o texto completo
        >
            {getDisplayText(nameStatus)}
        </p>
    );
};