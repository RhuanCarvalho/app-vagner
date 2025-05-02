"use client"
import { CheckIcon } from "lucide-react"


interface CustomCheckboxProps {
  isChecked: boolean; 
  setIsChecked: (checked: boolean, value: any) => void;
  activateWarning: boolean;
  disabledComment?: boolean;
  valueChecked: any;
}

export default function CustomCheckbox({isChecked, setIsChecked, valueChecked, activateWarning=false, disabledComment=false}:CustomCheckboxProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-start gap-1">
        <button
          type="button"
          onClick={() => setIsChecked(!isChecked, valueChecked)}
          className={`group relative flex items-center justify-center rounded-lg border-2 pl-3 pr-6 py-2 font-medium transition-all duration-300 ease-in-out ${
            isChecked
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md "
              : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 transition-all duration-300 ${
                isChecked
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-gray-300 bg-white group-hover:border-gray-400 "
              }`}
            >
              {isChecked && <CheckIcon className="h-4 w-4" />}
            </div>
            <span className="text-sm">Confirmar Data</span>
          </div>

          {isChecked && (
            <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
              ✓
            </div>
          )}
        </button>
          { !disabledComment &&
            <p
              className={`w-full text-sm transition-colors text-center ${(activateWarning && !isChecked) ? "text-red-500" : isChecked ? "text-emerald-600" : "text-gray-500"}`}
            >
              {isChecked ? "Data confirmada!" : "Clique para confirmar a data"}
            </p>
          }
      </div>
    </div>
  )
}