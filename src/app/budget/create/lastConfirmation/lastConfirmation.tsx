"use client"

import Modal from "@/components/modal/modal";
import { SubTitle } from "../title/subTitle";
import { ServiceForm } from "../page";
import { Divider } from "@/components/divider/divider";
import dayjs from "dayjs";

interface ModalLastConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onOk: () => void;
    services: ServiceForm[];
    total: number;
    date: {
        original: {
            period: string;
            date: string;
        },
        suggested: {
            period: string;
            date: string;
        }[]
    }
}


export const ModalLastConfirmation = ({ isOpen, onClose, onOk, services, total, date }: ModalLastConfirmationProps) => {

    const handleSubmit = () => {
        onClose();
    };

    const closeInX = () => {
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={closeInX}>
            <div className="w-[333px] p-2 pt-1 flex flex-col justify-center items-center gap-1">
                <SubTitle message='Confirmar' />
                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <div className="flex w-full items-center justify-between">
                        <p className="font-semibold text-ms w-full text-start">Data {date.suggested.length > 0 && "original"}</p>
                        <p className={`font-semibold text-ms w-full text-start min-w-max ${(date.suggested.length > 0) && "line-through"}`}>{dayjs(date.original.date).format("DD/MM/YYYY")}, período da {date.original.period}</p>
                    </div>
                    {date.suggested.length > 0 &&
                        date.suggested.map((d, i) => {
                            return (
                                <div className="flex w-full items-center justify-between">
                                    <p className="font-semibold text-ms w-full text-start">Sugestão data {date.suggested.length > 1 && i+1}</p>
                                    <p className={`font-semibold text-ms w-full text-start min-w-max`}>{dayjs(date.original.date).format("DD/MM/YYYY")}, período da {date.original.period}</p>
                                </div>
                            )
                        })

                    }
                </div>

                <div className="flex justify-center items-center p-2 w-full">
                    <button
                        onClick={handleSubmit}
                        className="transition-all w-[60%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                    >
                        Sugerir
                    </button>
                </div>
            </div>
        </Modal>
    );
}
