"use client"

import { Container } from "@/components/containers/defaultContainer";
import { HeaderTemplate } from "@/components/header/header";
import { useParams, useRouter } from "next/navigation";
import { TitleHeader } from "./title/tile";
import { users } from "@/fakeData/fakeData";
import { SubTitle } from "./title/subTitle";
import { Divider } from "../../../../components/divider/divider";
import { InputValueServices } from "./input-value-services.tsx/input-values-services";
import FileUpload from "@/components/addFiles/file-upload";

interface BudgetCreatePageProps {
}

export default function BudgetCreatePage({ }: BudgetCreatePageProps) {
    const router = useRouter()
    const params = useParams();
    const id = params?.id

    const selectUser = users.find(user => user.finishedNumberCell === id);
    const budget = selectUser?.budgets[0] 

    const handleResponseClick = () => {
        router.push('/budget/list/1234')
    }

    return (
        <Container>
            <div>
                <HeaderTemplate />
                <TitleHeader title={budget?.car!} />
                <div className="w-max px-6 pt-8">
                    <p className="bg-blue-500 text-white shadow-lg font-medium text-lg px-8 py-1 rounded-lg">Expira em {budget?.expire}</p>
                </div>
                <div>
                    <SubTitle message='Sobre o agendamento' />
                    <div className="px-6">
                        <div className="w-full flex justify-between py-1 items-center">
                            <p>{budget?.car}</p>
                            <p>-</p>
                            <p>{budget?.km} KM</p>
                            <p>-</p>
                            <p>{budget?.genero} {budget?.idade} anos</p>
                        </div>
                        <Divider />
                        <div className="w-full flex justify-between py-1 items-center">
                            <p>Data</p>
                            <p>{budget?.prazo}, período da {budget?.periodo}</p>
                        </div>
                        <Divider />
                    </div>
                    <SubTitle message='Serviços' />
                    <div className="px-6">
                        {budget?.services.map((service, id) => (
                            <div key={id} className="w-full flex justify-between py-1 items-center">
                                <p>{service.name_service}</p>
                                <InputValueServices value={service.value} />
                            </div>

                        ))}
                    </div>
                    <SubTitle message='Adicionar arquivos' />
                    <div className="w-full flex justify-center px-6">
                        <FileUpload />
                    </div>

                    <SubTitle message='Informações adicionais' />
                    <div className="px-6">
                        <textarea
                            className="w-full border-slate-300 border-1 rounded-lg h-32 p-2 shadow-lg resize-none"
                            placeholder="Digite aqui..."
                        />
                    </div>
                    <div className="flex justify-center items-center p-2">
                        <button
                            onClick={handleResponseClick}
                            className="transition-all w-[60%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                        >
                            Responder
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    )
}