'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { Container } from "@/components/containers/defaultContainer";
import { InvalidPageAccess } from "@/components/invalidPageAccess/InvalidPageAccess";
import Modal from "@/components/modal/modal";
import VerificationCode from "@/components/verificationCode/verificationCode";
import { useAllServices } from "@/services/allServices";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function CheckinPage() {

    const router = useRouter()

    const { state: { retornoMessageAPI }, actions: { verifyCodeCheckin, cleanMessage } } = useAllServices();
    const searchParams = useSearchParams();
    const company = searchParams.get('company') as string;
    const id = searchParams.get('id') as string;
    const type = searchParams.get('type') as string;

    const [code, setCode] = useState('');
    const handleSetCode = (code: string) => setCode(code);

    const [invalidUrl, setInvalidUrl] = useState(false);
    const [invalidClicked, setInvalidClicked] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);
    const [clearCode, setClearCode] = useState(false);


    useEffect(() => {
        if ([company, id, type].some(param => !param)) {
            setInvalidUrl(true);
        }
    }, [company, id, type]);

    const handleClick = async () => {

        const completeCode = code.padStart(4, '0');

        if (code.length == 4) {
            setInvalidClicked(false);
            const isValidCode = await verifyCodeCheckin({
                code: completeCode,
                company: company,
                id: id,
                type: type,
            });
            // 🎯 DISPARA O EVENTO PARA O GA4
            if (isValidCode) {
                sendGAEvent('event', `botao_checkin_${(type === 'estimate') ? 'ver_orcamento' : 'ver_agendamento'}`, {
                    company,
                    type,
                });
                router.push(`/budget/create`);
            } else {
                setInvalidCode(true);
                setClearCode(true);
            }
        } else {
            setInvalidClicked(true);
        }
    }

    const handleCloseModalInvalidCode = () => {
        cleanMessage();
        setInvalidCode(false);
        setClearCode(true);
    }

    return (
        <>
            {invalidUrl
                ?
                <InvalidPageAccess title="Houve um erro!" description="Solicite um novo Link!" />
                :
                <Container className="bg-[#000E1B]">
                    <div className="flex flex-col gap-14 pt-14 items-center">
                        <img src="/painel/link/capacete.svg" alt="" />
                        <div className="flex flex-col items-center bg-white w-[80%] h-[300px] rounded-xl">
                            <VerificationCode
                                title="Digite seu código de acesso"
                                subTitle="São os últimos 4 digitos do telefone cadastrado"
                                setValue={handleSetCode}
                                clearCode={clearCode}
                                setClearCode={setClearCode}
                            />
                            <button
                                className={`${code.length < 4 ? "cursor-not-allowed" : "cursor-pointer"} active:bg-blue-600 transition-all  w-[65%] px-4 py-2 active:scale-105 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg`}
                                onClick={handleClick}
                            >
                                {(type === 'estimate') ? 'Ver orçamento' : 'Ver agendamento'}
                            </button>
                            {(code.length < 4 && invalidClicked) && <p className="text-xs text-red-500 font-medium">Preencha corretamente o código</p>}
                        </div>
                    </div>
                </Container>
            }
            <Modal
                isOpen={invalidCode}
                onClose={handleCloseModalInvalidCode}
            >
                <div className="w-full p-2 pt-4 flex flex-col justify-center items-center gap-4 ">
                    <p className="font-semibold">Codigo Inválido!</p>
                    <span className="font-semibold text-[10px] max-w-[264px] text-center">{retornoMessageAPI}</span>
                    <button
                        className={`
                            cursor-pointer 
                            active:bg-blue-600 transition-all  
                            w-[75%] px-4 py-2 active:scale-105 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg`}
                        onClick={handleCloseModalInvalidCode}
                    >
                        Fechar
                    </button>
                </div>
            </Modal>
        </>
    )
}