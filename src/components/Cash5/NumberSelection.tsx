
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NumberSelectionType } from "./types";
import { Progress } from "@/components/ui/progress";

interface NumberSelectionProps {
  activeDigitIndex: number | null;
  setActiveDigitIndex: (index: number | null) => void;
  currentLine: NumberSelectionType;
  onDigitSelect: (digit: number) => void;
  isLineComplete: () => boolean;
  onClearSelections: () => void;
  colorValue?: string;
}

const NumberSelection: React.FC<NumberSelectionProps> = ({
  activeDigitIndex,
  setActiveDigitIndex,
  currentLine,
  onDigitSelect,
  isLineComplete,
  onClearSelections,
  colorValue = "#0EA5E9"
}) => {
  const getSelectionProgress = () => {
    // Calculate progress based on play type
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      // For pair types, we need 2 digits (excluding the 'X' digit)
      const filledCount = currentLine.digits.filter(d => d !== null && d !== -1).length;
      return (filledCount / 2) * 100;
    } else {
      // For other types, we need all 3 digits
      const filledCount = currentLine.digits.filter(d => d !== null).length;
      return (filledCount / 3) * 100;
    }
  };

  const renderDigitButtons = () => {
    const digitsArray = Array.from({ length: 10 }, (_, i) => i);
    
    return (
      <div className="grid grid-cols-5 gap-2 mb-4">
        {digitsArray.map((digit) => (
          <button
            key={digit}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium
              ${currentLine.digits.includes(digit) 
                ? "text-white" 
                : "bg-gray-100 text-black hover:bg-gray-200"}`}
            onClick={() => onDigitSelect(digit)}
            style={currentLine.digits.includes(digit) ? { backgroundColor: colorValue } : {}}
          >
            {digit}
          </button>
        ))}
      </div>
    );
  };

  const renderDigitDisplay = () => {
    return (
      <div className="flex justify-center space-x-2 mb-5 mt-2">
        {currentLine.digits.map((digit, index) => (
          <button
            key={index}
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold
              ${activeDigitIndex === index ? `border-${colorValue.replace('#', '')} bg-opacity-10` : 'border-gray-200'}
              ${digit !== null ? 'bg-white' : 'bg-gray-50'}`}
            onClick={() => setActiveDigitIndex(index)}
            disabled={
              (currentLine.playType === "Back Pair" && index === 0) ||
              (currentLine.playType === "Front Pair" && index === 2)
            }
            style={activeDigitIndex === index ? { borderColor: colorValue, backgroundColor: `${colorValue}10` } : {}}
          >
            {digit === null 
              ? '' 
              : digit === -1 
                ? 'X' 
                : digit}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 mt-4">
        <p className="text-sm font-medium">Selecione os Dígitos</p>
        <span className="text-xs font-medium">{getSelectionProgress().toFixed(0)}%</span>
      </div>
      
      <div className="mb-4">
        <Progress 
          value={getSelectionProgress()}
          className="h-2"
          style={{ backgroundColor: "#e5e7eb" }}
        />
      </div>
      
      {renderDigitDisplay()}
      {renderDigitButtons()}
      
      <div className="flex justify-end">
        <Button 
          onClick={onClearSelections}
          className="text-xs h-8 text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
        >
          LIMPAR
        </Button>
      </div>
    </div>
  );
};

export default NumberSelection;
