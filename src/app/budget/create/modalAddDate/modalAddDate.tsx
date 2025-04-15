"use client"
import Modal from "@/components/modal/modal";
import DatePicker from 'rsuite/DatePicker';
import SelectPicker from 'rsuite/SelectPicker';
import 'rsuite/DatePicker/styles/index.css';
import 'rsuite/SelectPicker/styles/index.css';
import dayjs from 'dayjs'

import { SubTitle } from "../title/subTitle";
import { useEffect, useState } from "react";


interface ModalAddDateProps {
    isOpen: boolean;
    onClose: () => void;
    saveInfo: (data: any) => void;
    info?: {
        suggestions?: { date: string; period: string }[];
        observation?: string;
    };
}


export const ModalAddDate = ({ isOpen, onClose, saveInfo, info }: ModalAddDateProps) => {

    const [date1, setDate1] = useState<Date | null>(null);
    const [period1, setPeriod1] = useState<string | null>(null);

    const [date2, setDate2] = useState<Date | null>(null);
    const [period2, setPeriod2] = useState<string | null>(null);

    const [date3, setDate3] = useState<Date | null>(null);
    const [period3, setPeriod3] = useState<string | null>(null);

    const [observation, setObservation] = useState('');
    const [error, setError] = useState<string | null>(null);

    const data = ['manhã', 'tarde'].map(item => ({
        label: item,
        value: item,
    }));

    const cleanStates = () => {
        setDate1(null);
        setPeriod1(null);
        setDate2(null);
        setPeriod2(null);
        setDate3(null);
        setPeriod3(null);
    }

    useEffect(() => {
        cleanStates();
        if (info?.suggestions) {
            const parseDDMMYYYY = (str: string): Date | null => {
                const [day, month, year] = str.split('/');
                if (!day || !month || !year) return null;
    
                const date = new Date(Number(year), Number(month) - 1, Number(day));
                return isNaN(date.getTime()) ? null : date;
            };
    
            info.suggestions.forEach((s, index) => {
                const parsedDate = s?.date ? parseDDMMYYYY(s.date) : null;
                const period = s?.period || null;
    
                switch (index) {
                    case 0:
                        setDate1(parsedDate);
                        setPeriod1(period);
                        break;
                    case 1:
                        setDate2(parsedDate);
                        setPeriod2(period);
                        break;
                    case 2:
                        setDate3(parsedDate);
                        setPeriod3(period);
                        break;
                }
            });
        } 
    
        setObservation(info?.observation || '');
    }, [info, isOpen]);
    
    
    

    const handleSubmit = () => {
        const filledSuggestions = [
            { date: date1, period: period1 },
            { date: date2, period: period2 },
            { date: date3, period: period3 }
        ].filter(s => s.date && s.period);

        if (filledSuggestions.length === 0) {
            setError("Preencha pelo menos uma sugestão com data e período.");
            return;
        }

        // if (!observation.trim()) {
        //     setError("A observação é obrigatória.");
        //     return;
        // }

        setError(null);
        saveInfo({
            suggestions: filledSuggestions.map(s => ({
                date: dayjs(s.date).format('DD/MM/YYYY'),
                period: s.period
            })),
            observation
        });

        cleanStates();
        onClose();
    };

    const closeInX = () => {
        cleanStates();
        onClose();
    }


    const renderSuggestion = (
        label: string,
        date: Date | null,
        setDate: (value: Date | null) => void,
        period: string | null,
        setPeriod: (value: string | null) => void
    ) => (
        <div className="flex flex-col gap-1">
            <p className="font-semibold text-xs w-full text-start">{label}</p>
            <div className="flex gap-2">
                <DatePicker
                    oneTap
                    onFocus={(e) => e.target.blur()}
                    value={date}
                    onChange={setDate}
                />
                <SelectPicker
                    placeholder='Período'
                    data={data}
                    searchable={false}
                    style={{ width: 100 }}
                    value={period}
                    onChange={setPeriod}
                />
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={closeInX}>
            <div className="w-full p-2 pt-4 flex flex-col justify-center items-center gap-4">
                <SubTitle message='Sugerir Data' />
                <div className="flex flex-col justify-center items-center gap-2">
                    {renderSuggestion("Sugestão 1", date1, setDate1, period1, setPeriod1)}
                    {renderSuggestion("Sugestão 2", date2, setDate2, period2, setPeriod2)}
                    {renderSuggestion("Sugestão 3", date3, setDate3, period3, setPeriod3)}

                    <div className="flex flex-col gap-1 w-full">
                        <p className="font-semibold text-xs w-full text-start">Observação</p>
                        <textarea
                            className="border rounded-lg p-2 border-slate-300 resize-none h-24 w-full"
                            placeholder="Digite sua observação"
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-medium max-w-[216px] text-center">
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
    );
}
