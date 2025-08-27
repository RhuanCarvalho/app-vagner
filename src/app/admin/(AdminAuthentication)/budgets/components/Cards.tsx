import { Status, StatusType } from "./Status";

export interface CardBudgetProps {
    index: string;
    name: string;
    serives: string;
    status: StatusType;
}

export const CardBudget = ({ index, name, serives, status }: CardBudgetProps) => {
    return (
        <div
            className={`
                flex justify-between items-center shadow-lg shadow-gray-200 w-max p-4
                hover:scale-105 cursor-pointer
                transition-all
                rounded-lg
                gap-10
                `}
        >
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <p className="font-bold text-gray-600">{index}</p>
                    <p className="font-semibold text-[14px] text-gray-600">{name}</p>
                </div>
                <p className="text-[14px] text-gray-600 max-w-60">Serviços: {serives}</p>
            </div>
            <Status nameStatus={status} />
        </div>
    )
}