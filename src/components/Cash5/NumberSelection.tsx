
import React from "react";
import { Button } from "@/components/ui/button";
import { NumberSelectionType } from "./types";

interface NumberSelectionProps {
  activeDigitIndex: number | null;
  setActiveDigitIndex: (index: number | null) => void;
  currentLine: NumberSelectionType;
  onDigitSelect: (digit: number) => void;
  isLineComplete: () => boolean;
  onClearSelections: () => void;
}

const NumberSelection: React.FC<NumberSelectionProps> = ({
  activeDigitIndex,
  setActiveDigitIndex,
  currentLine,
  onDigitSelect,
  isLineComplete,
  onClearSelections
}) => {
  const getDigitDisplay = (index: number) => {
    const digit = currentLine.digits[index];
    return digit !== null ? digit.toString() : "?";
  };

  const getNumberPosition = (index: number, totalNumbers: number) => {
    const angleStep = (2 * Math.PI) / totalNumbers;
    const angle = index * angleStep - Math.PI / 2;
    
    // Increased radius to 100
    const radius = 100;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      top: `${50 + y}%`,
      left: `${50 + x}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="relative mb-6 mt-8">
      <div className="flex justify-center items-center h-[280px] relative">
        <div className="absolute w-[220px] h-[220px] rounded-full border-2 border-blue-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        {[...Array(10).keys()].map((number) => {
          const position = getNumberPosition(number, 10);
          return (
            <button
              key={number}
              onClick={() => onDigitSelect(number)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium absolute"
              style={{
                ...position,
                backgroundColor:
                  activeDigitIndex !== null && currentLine.digits[activeDigitIndex] === number
                    ? '#0EA5E9'
                    : '#dbeafe',
                color:
                  activeDigitIndex !== null && currentLine.digits[activeDigitIndex] === number
                    ? 'white'
                    : '#1e40af'
              }}
            >
              {number}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 justify-center mt-4 mb-4">
        {currentLine.digits.map((digit, idx) => (
          <div 
            key={idx} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium border cursor-pointer ${
              activeDigitIndex === idx 
                ? 'bg-blue-500 text-white border-blue-600' 
                : digit === null 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-blue-100 text-blue-800'
            }`}
            onClick={() => setActiveDigitIndex(idx)}
          >
            {getDigitDisplay(idx)}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <Button 
          onClick={onClearSelections}
          variant="link" 
          className="text-xs text-gray-500"
        >
          Clear selections
        </Button>
      </div>
    </div>
  );
};

export default NumberSelection;
