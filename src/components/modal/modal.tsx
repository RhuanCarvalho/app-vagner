'use client'

import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}


export default function Modal({ isOpen, onClose, children }: ModalProps) {
    // Impede o scroll ao abrir modal
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        // Limpeza se componente desmontar
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 min-w-max max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-gray-600 hover:text-gray-900 text-xl"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}
