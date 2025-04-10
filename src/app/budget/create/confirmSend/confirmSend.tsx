import { useAllServices } from "@/services/allServices";

interface ConfirmationSendBugdgetProps {
    onClick?: () => void;
}


export const ConfirmationSendBugdget = ({ onClick }: ConfirmationSendBugdgetProps) => {
    
    const { state: { retornoMessageAPI }} = useAllServices();
    
    return (
        <div className="w-full pt-36 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-center">{!!retornoMessageAPI ? retornoMessageAPI : "Excelente, seu orçamento foi enviado com sucesso! Boa sorte!"}</p>
            <div className="w-full flex justify-center items-center pt-20">
                <button
                    onClick={onClick}
                    className="transition-all w-[60%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                >
                    Ver orçamentos
                </button>
            </div>
        </div>
    )
}