"use client"
import Modal from "@/components/modal/modal";
import DatePicker from 'rsuite/DatePicker';
import SelectPicker from 'rsuite/SelectPicker';
import 'rsuite/DatePicker/styles/index.css';
import 'rsuite/SelectPicker/styles/index.css';
import dayjs from 'dayjs'

import { SubTitle } from "../title/subTitle";
import { useEffect, useState } from "react";
import { InputValueServicesCustom } from "../input-value-services.tsx/input-values-services";


interface ModalAddServiceProps {
    isOpen: boolean;
    onClose: () => void;
    saveInfo: (data: any) => void;
}


export const ModalAddService = ({ isOpen, onClose, saveInfo }: ModalAddServiceProps) => {

    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const data = ['Alinhamento', 'Ajustes no Motor', 'Troca de Oleo', 'Revisão Geral'].map(item => ({
        label: item,
        value: item,
    }));

    const handleSubmit = () => {
        if (!selectedValue || !selectedService) {
            setError("Por favor, selecione um serviço e preencha um valor.");
            return;
        }

        setError(null);

        // Gera um ID aleatório simples
        const randomId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        saveInfo({ 
            service: selectedService,  
            value: selectedValue,
            id_service_item: randomId,
            isNew: true,
        });
        setSelectedValue(null);
        setSelectedService(null);
        onClose();

    };

    const closeInX = () => {
        setSelectedValue(null);
        setSelectedService(null);
        onClose();
    }


    useEffect(() => {
        if (selectedValue || selectedService) {
            setError(null);
        }
    }, [selectedService, selectedValue])

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={closeInX}
            >
                <div className="w-full p-2 pt-4 flex flex-col justify-center items-center gap-4 ">
                    <SubTitle message='Adicionar Serviço' />
                    <SelectPicker
                        placeholder='Serviço'
                        data={data}
                        // searchable={false}
                        style={{ width: 216 }}
                        value={selectedService}
                        onChange={setSelectedService}
                    />
                    <InputValueServicesCustom 
                        className="border rounded-md py-2 border-slate-300 text-sm w-[216] px-2"
                        placeholder="Digite o Valor do Serviço (R$)"
                        value={selectedValue}
                        onChange={setSelectedValue}
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
                            Adicionar
                        </button>
                    </div>
                </div>
            </Modal>

        </>
    )
}
