import { twMerge } from "tailwind-merge";

export type StatusType = 
  | "Orçamento pendente" 
  | "Aguardando aprovação" 
  | "Agendado" 
  | "Finalizado" 
  | "Pedido recusado" 
  | "Aguardando confirmação de nova data"
  | "Solicitação pendente";

interface StatusProps {
    nameStatus: StatusType;
}

export const Status = ({ nameStatus }: StatusProps) => {
    const selectStatus: Record<StatusType, string> = {
        "Orçamento pendente": "bg-yellow-200 text-yellow-900",
        "Aguardando aprovação": "bg-blue-200 text-blue-900",
        "Agendado": "bg-purple-200 text-purple-900",
        "Finalizado": "bg-green-200 text-green-900",
        "Pedido recusado": "bg-red-200 text-red-900",
        "Aguardando confirmação de nova data": "bg-orange-200 text-orange-900",
        "Solicitação pendente": "bg-gray-200 text-gray-900",
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


export const StatusConcorrencia = ({ nameStatus }: { nameStatus: string }) => {
    return (
        <p
            className={twMerge(
                "text-[14px] py-1 px-2 rounded-lg font-bold whitespace-nowrap w-max",
                "bg-red-200 text-red-900"
            )}
            title={nameStatus} // Tooltip com o texto completo
        >
            {nameStatus}
        </p>
    );
};