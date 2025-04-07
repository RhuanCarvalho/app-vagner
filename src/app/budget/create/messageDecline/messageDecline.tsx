
interface ConfirmDeclineBugdgetProps {
    onClick?: () => void;
}


export const ConfirmDeclineBugdget = ({ onClick }: ConfirmDeclineBugdgetProps) => {
    return (
        <div className="w-full pt-36 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-center">Ok! Esse orçamento foi Declinado!</p>
            <div className="w-full flex justify-center items-center pt-20">
                <button
                    onClick={onClick}
                    className="transition-all w-[60%] bg-blue-500 rounded-full active:scale-105 active:bg-blue-600 hover:bg-blue-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                >
                    Ver outros orçamentos
                </button>
            </div>
        </div>
    )
}