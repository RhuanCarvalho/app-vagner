"use client"
import { useEffect } from "react";

interface OptionProps {
    title: string;
    value: string;
}

interface TabProps {
    options: OptionProps[];
    selected?: string;
    onChange: any;
}

export const Tabs = ({ options, selected, onChange }: TabProps) => {
    return (
        <div className="flex w-full pt-2">
            {options.map((option, index) => (
                <div key={index}
                    className="w-full cursor-pointer active:scale-105"
                    onClick={() => onChange(option.value)}
                >
                    <p className={`
                        transition-all
                        pb-2 text-center font-bold
                        ${option.value == selected ? "text-blue-500" : "text-slate-400"}    
                        `}>
                            {option.title}
                    </p>
                    <div className={`
                        transition-all
                        h-1
                        ${option.value == selected ? "bg-blue-500" : "bg-slate-400"}    
                        `}></div>
                </div>
            ))}
        </div>
    )
}