
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NumberSelectionProps {
  selectedDigits: (number | null | "X")[];
  activeDigitIndex: number | null;
  onDigitSelect: (index: number) => void;
  colorValue: string;
  isPairSelection: boolean;
}

const NumberSelection: React.FC<NumberSelectionProps> = ({
  selectedDigits,
  activeDigitIndex,
  onDigitSelect,
  colorValue,
  isPairSelection,
}) => {
  const digitButtons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4 mb-2">
        {selectedDigits.map((digit, index) => {
          // Se for uma seleção de par e o índice for 0, mostramos X e desabilitamos
          if (isPairSelection && index === 0) {
            return (
              <div
                key={index}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 text-xl font-bold"
              >
                <X size={24} />
              </div>
            );
          }

          const isSelected = activeDigitIndex === index;
          const hasValue = digit !== null && digit !== "X";
          
          return (
            <div
              key={index}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                isSelected
                  ? `border-2 border-[${colorValue}]`
                  : "border border-gray-300"
              } ${hasValue ? `bg-[${colorValue}] text-white` : "bg-white text-[#0088cc]"}`}
              onClick={() => onDigitSelect(index)}
            >
              {hasValue ? digit : "?"}
            </div>
          );
        })}
      </div>

      {activeDigitIndex !== null && !isPairSelection && (
        <div className="grid grid-cols-5 gap-2">
          {digitButtons.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className={`rounded-full h-10 w-10 p-0 font-bold ${
                selectedDigits[activeDigitIndex] === num
                  ? `bg-[${colorValue}] text-white hover:bg-[${colorValue}]/90`
                  : ""
              }`}
              onClick={() => {
                const updatedDigits = [...selectedDigits];
                updatedDigits[activeDigitIndex] = num;
              }}
            >
              {num}
            </Button>
          ))}
        </div>
      )}
      
      {activeDigitIndex !== null && isPairSelection && activeDigitIndex > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {digitButtons.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className={`rounded-full h-10 w-10 p-0 font-bold ${
                selectedDigits[activeDigitIndex] === num
                  ? `bg-[${colorValue}] text-white hover:bg-[${colorValue}]/90`
                  : ""
              }`}
              onClick={() => {
                const updatedDigits = [...selectedDigits];
                updatedDigits[activeDigitIndex] = num;
              }}
            >
              {num}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumberSelection;
