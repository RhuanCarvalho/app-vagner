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
                hover:scale-[1.02] cursor-pointer
                transition-all
                rounded-lg
                gap-4
                bg-white
                border border-gray-100
                flex-col
            `}
        >
            <div className="flex flex-col gap-2 flex-1 min-w-0 items-start w-full">
                <div className="flex gap-2 items-center w-full">
                    <p className="font-bold text-gray-600 whitespace-nowrap">{index}</p>
                    <p className="font-semibold text-[14px] text-gray-600 truncate">{name}</p>
                </div>
                <p className="text-[14px] text-gray-600 w-full">Serviços: {services}</p>
            </div>
            <div className="w-full justify-start">
                <Status nameStatus={status} />
            </div>
        </div>
    )
}