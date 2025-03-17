
import { BudgetProps, users } from "@/fakeData/fakeData";
import { useEffect, useState } from "react";
import { CardsView } from "./cards/cards";
import { userAgent } from "next/server";

interface BudgetsPageProps {
    id: string;
}

const options = [
    {
        title: "Todos",
        value: "all"
    },
    {
        title: "Respondidos",
        value: "answered"
    },
    {
        title: "Pendentes",
        value: "pending"
    },
    {
        title: "Expirados",
        value: "expired"
    },
]

export const BudgetsPage = ({ id }: BudgetsPageProps) => {

    const [value, setValue] = useState("all");
    const [budgets, setBudgets] = useState<BudgetProps[]>([]);



    const selectedOption = options.find(option => option.value === value);

    const selectUser = users.find(user => user.finishedNumberCell === id);
    const startBudgets: BudgetProps[] = selectUser?.budgets as BudgetProps[];


    useEffect(() => {
        const filterBudgets = (status: string): BudgetProps[] => {
            return status === 'all' ? startBudgets : startBudgets.filter(budget => budget.status === status)
        };

        setBudgets(filterBudgets(value));

    }, [value])

    return (
        <div className="overflow-y-hidden">

            <div className="w-full py-4 px-6 flex justify-between items-center">
                <h2 className="font-bold text-xl w-full">
                    Orçamentos {value === "all" ? "" : selectedOption?.title}
                </h2>
                <div className="w-max flex justify-end items-center">
                    <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="p-2 rounded border border-slate-200 font-light text-sm selection:border-slate-200 active:border-slate-200 focus:border-slate-200"
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="w-full overflow-y-hidden">
                {budgets.map((b, id) => (
                    <CardsView
                        key={id}
                        car={b.car}
                        start_hour={b.start_hour}
                        end_hour={b.end_hour}
                        service={b.services[0].name_service}
                        label_status={b.label_status}
                    />
                ))}
            </div>
        </div>
    )
}
