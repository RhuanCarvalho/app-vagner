"use client"

import type React from "react"

import { useRef, useState, type KeyboardEvent, type ChangeEvent, useEffect } from "react"
import { cn } from "@/lib/utils"


interface VerificationCodeProps {
    title: string;
    subTitle: string;
    setValue: (value: string) => void;
    clearCode: boolean;
    setClearCode: (clearCode: boolean) => void;
}

export default function VerificationCode({ title, subTitle, setValue, clearCode, setClearCode }: VerificationCodeProps) {
    const [code, setCode] = useState<string[]>(["", "", "", ""])
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        setClearCode(false);
        const value = e.target.value

        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        // Take only the last character if multiple are pasted
        const digit = value.slice(-1)

        // Update the code state
        const newCode = [...code]
        newCode[index] = digit
        setCode(newCode)

        // Move to next input if a digit was entered
        if (digit && index < 3) {
            inputRefs[index + 1].current?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === "Backspace") {
            if (code[index] === "" && index > 0) {
                // If current field is empty and backspace is pressed, go to previous field
                const newCode = [...code]
                newCode[index - 1] = ""
                setCode(newCode)
                inputRefs[index - 1].current?.focus()
            } else if (code[index] !== "") {
                // If current field has a value, clear it
                const newCode = [...code]
                newCode[index] = ""
                setCode(newCode)
            }
        }

        // Handle left arrow key
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs[index - 1].current?.focus()
        }

        // Handle right arrow key
        if (e.key === "ArrowRight" && index < 3) {
            inputRefs[index + 1].current?.focus()
        }
    }

    // Handle paste event for the entire code
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text")
        const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 4)

        if (pastedDigits) {
            const newCode = [...code]
            for (let i = 0; i < pastedDigits.length; i++) {
                if (i < 4) {
                    newCode[i] = pastedDigits[i]
                }
            }
            setCode(newCode)

            // Focus the next empty field or the last field
            const nextEmptyIndex = newCode.findIndex((digit) => digit === "")
            if (nextEmptyIndex !== -1) {
                inputRefs[nextEmptyIndex].current?.focus()
            } else {
                inputRefs[3].current?.focus()
            }
        }
    }

    // Get the complete verification code
    const completeCode = code.join("")

    // Log the complete code when all digits are entered (for demonstration)
    useEffect(() => {
        setValue(completeCode);
    }, [completeCode])

    useEffect(() => {
        if (clearCode) {
            setCode(["", "", "", ""]);
        }
    }, [clearCode])

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">{title}</h2>
            <p className="text-center text-sm text-gray-500">{subTitle}</p>

            <div className="flex items-center justify-center space-x-3" onPaste={handlePaste}>
                {[0, 1, 2, 3].map((index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={code[index]}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={cn(
                            "w-14 h-14 text-center text-2xl font-bold rounded-md border-2",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                            "transition-all duration-200",
                            code[index] ? "border-primary bg-primary/5" : "border-gray-300",
                        )}
                        aria-label={`Digit ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

