"use client"

import Modal from "@/components/modal/modal";
import { SubTitle } from "../title/subTitle";
// import { ServiceForm } from "../page";
import { Divider } from "@/components/divider/divider";
import dayjs from "dayjs";
import { ServiceForm } from "../../budgets/openBudget/openBudget";
import { formatCurrency } from "../../budgets/openBudget/input-value-services.tsx/input-values-services";
import { CompromissosProps } from "@/services/adminServices/schedule/scheduleServices";

interface ModalViewInfoScheduleProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: CompromissosProps;
    services: ServiceForm[];
    total: number;
    date: {
        original: {
            period: string | null;
            date: string | null;
        },
        suggested: {
            period: string;
            date: string;
        }[]
    }
}


export const ModalViewInfoSchedule = ({ isOpen, onClose, services, total, date, schedule }: ModalViewInfoScheduleProps) => {

    const handleSubmit = () => {
        onClose();
    };

    const closeInX = () => {
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={closeInX}>
            <div className="w-[333px] p-2 pt-1 flex flex-col justify-center items-center gap-1">
                <SubTitle message={`${schedule.car}`} />
                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <p className="font-bold text-sm w-full text-start">Data</p>
                    { date.original.date != null &&
                        <div className="flex w-full items-center justify-between pl-2">
                            {date.suggested.length > 0 &&
                            <p className={`font-semibold text-[12px] w-full text-start`}>{date.suggested.length > 0 && "Original"}</p>
                            }
                            <p className={`font-semibold text-[12px] w-full min-w-max ${(date.suggested.length > 0) ? "line-through text-end":"text-start"}`}>
                                {dayjs(date.original.date, "YYYY-MM-DD").format("DD/MM/YYYY")}, período da {date.original.period}
                            </p>
                        </div>
                    }
                    {date.suggested.length > 0 &&
                        date.suggested.map((d, i) => {
                            return (
                                <div key={i} className="flex w-full items-center justify-between pl-2">
                                    <p className="font-semibold text-[12px] w-full text-start">Sugestão data {date.suggested.length > 1 && i+1}</p>
                                    {/* <p className={`font-semibold text-[12px] w-full text-end min-w-max`}>{d.date}, período da {d.period}</p> */}
                                    <p className={`font-semibold text-[12px] w-full text-end min-w-max`}>{dayjs(d.date, "YYYY-MM-DD").format("DD/MM/YYYY")}, período da {d.period}</p>
                                </div>
                            )
                        })

                    }
                </div>
                <div className="w-full flex flex-col justify-center items-center gap-2 pt-4">
                    <p className="font-bold text-sm w-full text-start">Serviços</p>
                    { services.map((s, i) => {
                            return (
                                <div key={i} className="flex w-full items-center justify-between pl-2">
                                    <p className="font-semibold text-[12px] w-full text-start">{s.service}</p>
                                    <p className={`font-semibold text-[12px] min-w-max text-end`}>{formatCurrency(s.value)}</p>
                                </div>
                            )
                        })

                    }
                    <div className="w-full text-xs font-bold">
                        <div className="w-full flex justify-end gap-3 py-1 items-center">
                            <p>Total:</p>
                            <p>{formatCurrency(total)}</p>
                        </div>
                    </div>
                </div>

                {/* <div className="py-4 w-full text-xs">
                    <p>
                        <span className="font-bold text-xs">* Atenção:</span> O cliente será informado que o valor é apenas uma estimativa que poderá ser alterado após a avaliação presencial.
                    </p>
                </div> */}

                <div className="flex justify-center items-center p-2 w-full">
                    <button
                        onClick={closeInX}
                        className="transition-all w-[80%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
