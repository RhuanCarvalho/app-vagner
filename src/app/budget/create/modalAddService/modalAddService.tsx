"use client"
import Modal from "@/components/modal/modal";
import SelectPicker from 'rsuite/SelectPicker';
import 'rsuite/DatePicker/styles/index.css';
import 'rsuite/SelectPicker/styles/index.css';

import { SubTitle } from "../title/subTitle";
import { useEffect, useState } from "react";
import { InputValueServicesCustom } from "../input-value-services.tsx/input-values-services";
import { useAllServices } from "@/services/allServices";


interface ModalAddServiceProps {
    isOpen: boolean;
    onClose: () => void;
    saveInfo: (data: any) => void;
}


export const ModalAddService = ({ isOpen, onClose, saveInfo }: ModalAddServiceProps) => {

    const { state: { checkinData, categorias, services }, actions: { getCategories, getServices } } = useAllServices();

    const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCategories(Number(checkinData.company));
    }, [isOpen])

    useEffect(() => {
        setSelectedService(null);
        setSelectedValue(null);
        if (selectedCategorie != null){
            getServices(Number(checkinData.company), Number(selectedCategorie))
        }
    }, [selectedCategorie])

    useEffect(() => {
        if (selectedService != null){
            const filteredService = services.filter(s => Number(s.id_service) == Number(selectedService))[0]
            setSelectedValue(Number(filteredService.price))
            console.log(filteredService)
        } else {
            setSelectedValue(null);
        }
    }, [selectedService])



    const handleSubmit = () => {
        if (!selectedValue || !selectedService || !selectedCategorie) {
            setError("Por favor, selecione uma categoria, um serviço e preencha um valor.");
            return;
        }

        setError(null);

        const selectService = services.filter(s => Number(s.id_service) == Number(selectedService))[0]
        const selectCategorie = categorias.filter(s => Number(s.id) == Number(selectedCategorie))[0]

        // Gera um ID aleatório simples
        const randomId = `${Date.now()}-${Math.floor(Math.random()*10000)}`;
        saveInfo({
            randomId: randomId,
            id_categoria: selectCategorie.id,
            categoria: selectCategorie.categoria,
            id_service: selectService.id_service,
            service: selectService.service,
            value: selectedValue,
            isNew: true,
        });

        setSelectedValue(null);
        setSelectedService(null);
        setSelectedCategorie(null);
        onClose();

    };

    const closeInX = () => {
        setSelectedValue(null);
        setSelectedService(null);
        setSelectedCategorie(null);
        onClose();
    }


    useEffect(() => {
        if (selectedValue || selectedService || selectedCategorie) {
            setError(null);
        }
    }, [selectedService, selectedValue, selectedCategorie])

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={closeInX}
            >
                <div className="w-full p-2 pt-4 flex flex-col justify-center items-center gap-4 ">
                    <SubTitle message='Adicionar Serviço' />
                    <SelectPicker
                        placeholder='Categoria'
                        data={categorias.map(c => { return { value: c.id, label: c.categoria } })}
                        // searchable={false}
                        style={{ width: 216 }}
                        value={selectedCategorie}
                        onChange={setSelectedCategorie}
                    />
                    <SelectPicker
                        disabled={selectedCategorie == null}
                        placeholder='Serviço'
                        data={services.map(c => { return { value: c.id_service, label: c.service } })}
                        // searchable={false}
                        style={{ width: 216 }}
                        value={selectedService}
                        onChange={setSelectedService}
                    />
                    <InputValueServicesCustom
                        disabled={selectedCategorie == null || selectedService == null}
                        className={`border rounded-md py-2 border-slate-300 text-sm w-[216] px-2 ${(selectedCategorie == null || selectedService == null) && "bg-gray-100 cursor-not-allowed"}`}
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
