import { Status, StatusType } from "./Status";

export interface CardBudgetProps {
    index: string;
    name: string;
    services: string;
    status: StatusType;
}

export const CardBudget = ({ index, name, services, status }: CardBudgetProps) => {
    return (
        <div
            className={`
                flex justify-between items-center shadow-lg shadow-gray-200 w-full p-4
                hover:scale-105 cursor-pointer
                transition-all
                rounded-lg
                gap-4
                bg-white
                border border-gray-100
            `}
        >
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex gap-2 items-center">
                    <p className="font-bold text-gray-600 whitespace-nowrap">#{index}</p>
                    <p className="font-semibold text-[14px] text-gray-600 truncate">{name}</p>
                </div>
                <p className="text-[14px] text-gray-600 truncate">Serviços: {services}</p>
            </div>
            <Status nameStatus={status} />
        </div>
    )
}