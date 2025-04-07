"use client"
import Modal from "@/components/modal/modal";


interface ModalConfirmeDeclineProps {
    isOpen: boolean;
    onClose: () => void;
    onFunction: () => void;
}


export const ModalConfirmeDecline = ({ isOpen, onClose, onFunction }: ModalConfirmeDeclineProps) => {
    
    const handleSubmit = () => {
        onFunction();
        onClose();
    };
    
    const closeInX = () => {
        onClose();
    }


    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={closeInX}
            >
                <div className="w-full p-2 pt-4 flex flex-col justify-center items-center gap-4 ">
                    <h2>Você tem certeza que deseja DECLINAR?</h2>
                    <div className="flex justify-center items-center p-2 w-full">
                        <button
                            onClick={handleSubmit}
                            className="transition-all w-[60%] bg-red-500 rounded-full active:scale-105 active:bg-red-600 hover:bg-red-600 cursor-pointer text-white text-medium font-bold py-2 px-4"
                        >
                            Declinar
                        </button>
                    </div>
                </div>
            </Modal>

        </>
    )
}
