
import React, { useEffect, useState } from "react";
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
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);

  useEffect(() => {
    if (currentLine.playType === "Back Pair") {
      // For Back Pair, focus on second digit if it's null
      if (currentLine.digits[1] === null) {
        setActiveDigitIndex(1);
      } else if (currentLine.digits[2] === null) {
        setActiveDigitIndex(2);
      }
    } else if (currentLine.playType === "Front Pair") {
      // For Front Pair, focus on first digit if it's null
      if (currentLine.digits[0] === null) {
        setActiveDigitIndex(0);
      } else if (currentLine.digits[1] === null) {
        setActiveDigitIndex(1);
      }
    } else if (activeDigitIndex === null && currentLine.digits.some(digit => digit === null)) {
      const firstEmptyIndex = currentLine.digits.findIndex(digit => digit === null);
      if (firstEmptyIndex !== -1) {
        setActiveDigitIndex(firstEmptyIndex);
      }
    }
  }, [activeDigitIndex, currentLine.digits, currentLine.playType, setActiveDigitIndex]);

  const handleNumberClick = (digit: number) => {
    setClickedNumber(digit);
    onDigitSelect(digit);
    
    setTimeout(() => {
      setClickedNumber(null);
    }, 2000);
  };

  const getDigitDisplay = (index: number) => {
    const digit = currentLine.digits[index];
    
    // Special case for "X" representation
    if (digit === -1) {
      return "X";
    }
    
    return digit !== null ? digit.toString() : "?";
  };

  const isDigitDisabled = (index: number) => {
    return (currentLine.playType === "Back Pair" && index === 0) || 
           (currentLine.playType === "Front Pair" && index === 2);
  };
  
  // Get appropriate heading text based on play type
  const getHeadingText = () => {
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      return "Escolha 2 Números";
    }
    return "Escolha 3 Números";
  };

  return (
    <div className="relative mb-6 mt-8">
      <h2 className="text-center text-xl font-semibold mb-4 text-blue-800">
        {getHeadingText()}
      </h2>
      
      <div className="flex justify-center items-center h-[220px] relative">
        <div className="grid grid-cols-5 gap-4 z-10">
          {[...Array(10).keys()].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium transition-colors duration-300`}
              style={{
                backgroundColor: clickedNumber === number 
                  ? '#0EA5E9'
                  : activeDigitIndex !== null && currentLine.digits[activeDigitIndex] === number
                    ? '#0EA5E9'
                    : '#dbeafe',
                color: clickedNumber === number || 
                      (activeDigitIndex !== null && currentLine.digits[activeDigitIndex] === number)
                  ? 'white'
                  : '#1e40af'
              }}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2 justify-center mt-4 mb-4">
        {currentLine.digits.map((digit, idx) => {
          const isDisabled = isDigitDisabled(idx);
          const isActive = activeDigitIndex === idx && !isDisabled;
          const isX = digit === -1;
          
          // Determine the appropriate style based on state
          let bgColor = isActive ? 'bg-blue-500' : isX ? 'bg-gray-200' : digit === null ? 'bg-gray-100' : 'bg-blue-100';
          let textColor = isActive ? 'text-white' : isX ? 'text-gray-700' : digit === null ? 'text-gray-400' : 'text-blue-800';
          let borderColor = isActive ? 'border-blue-600' : isX ? 'border-gray-300' : 'border-gray-200';
          
          return (
            <div 
              key={idx} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium border cursor-pointer ${bgColor} ${textColor} ${borderColor} ${isDisabled ? 'cursor-not-allowed' : ''}`}
              onClick={() => !isDisabled && setActiveDigitIndex(idx)}
            >
              {getDigitDisplay(idx)}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end mt-2">
        <Button 
          onClick={onClearSelections}
          variant="link" 
          className="text-xs text-gray-500"
        >
          Limpar seleções
        </Button>
      </div>
    </div>
  );
};

export default NumberSelection;
