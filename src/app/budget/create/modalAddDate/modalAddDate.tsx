"use client"
import Modal from "@/components/modal/modal";
import DatePicker from 'rsuite/DatePicker';
import SelectPicker from 'rsuite/SelectPicker';
import 'rsuite/DatePicker/styles/index.css';
import 'rsuite/SelectPicker/styles/index.css';
import dayjs from 'dayjs'

import { SubTitle } from "../title/subTitle";
import { useState } from "react";


interface ModalAddDateProps {
    isOpen: boolean;
    onClose: () => void;
    saveInfo: (data: any) => void;
}


export const ModalAddDate = ({ isOpen, onClose, saveInfo }: ModalAddDateProps) => {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const data = ['manhã', 'tarde'].map(item => ({
        label: item,
        value: item,
    }));

    const handleSubmit = () => {
        if (!selectedDate || !selectedPeriod) {
            setError("Por favor, selecione a data e o período.");
            return;
        }

        setError(null);
        saveInfo({ date: dayjs(selectedDate).format('DD/MM/YYYY'), period: selectedPeriod });
        setSelectedDate(null);
        setSelectedPeriod(null);
        onClose();
    };
    
    const closeInX = () => {
        setSelectedDate(null);
        setSelectedPeriod(null);
        onClose();
    }


    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={closeInX}
            >
                <div className="w-full p-2 pt-4 flex flex-col justify-center items-center gap-4 ">
                    <SubTitle message='Sugerir Data' />
                    <DatePicker
                        oneTap
                        onFocus={(e) => e.target.blur()}
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                    <SelectPicker
                        placeholder='Período'
                        data={data}
                        searchable={false}
                        style={{ width: 216 }}
                        value={selectedPeriod}
                        onChange={setSelectedPeriod}
                    />
                    {error && (
                        <p className="text-red-500 text-sm font-medium max-w-[216] text-center">
                            {error}
                        </p>
                    )}
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

        </>
    )
}
