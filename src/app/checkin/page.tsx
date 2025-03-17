"use client"
import { Container } from "@/components/containers/defaultContainer";
import VerificationCode from "@/components/verificationCode/verificationCode";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function CheckinPage(){

    const router = useRouter()

    const [code, setCode] = useState('');
    const handleSetCode = (code: string) => setCode(code);

    const [invalidClicked, setInvalidClicked] = useState(false);

    const handleClick = () => {
        const completeCode = code.padStart(4, '0');
        if(code.length == 4){
            setInvalidClicked(false);
        } else {
            setInvalidClicked(true);
        }

        if(completeCode === '1234') {
            router.push('/budget/create/1234');
        }
    }

    return (
        <Container className="bg-[#000E1B]">
            <div className="flex flex-col gap-14 pt-14 items-center">
                <img src="./capacete.svg" alt="" />
                <div className="flex flex-col items-center bg-white w-[80%] h-[300px] rounded-xl">
                    <VerificationCode 
                        title="Digite seu código de acesso"
                        subTitle="São os últimos 4 digitos do telefone cadastrado"
                        setValue={handleSetCode}
                        />
                <button
                    className={`${code.length < 4 ? "cursor-not-allowed": "cursor-pointer"} active:bg-blue-600 transition-all  w-[65%] px-4 py-2 active:scale-105 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg`}
                    onClick={handleClick}
                    >
                        Abrir orçamento
                </button>
                {(code.length < 4  && invalidClicked) && <p className="text-xs text-red-500 font-medium">Preencha corretamente o código</p>}
                </div>
            </div>
        </Container>
    )
}