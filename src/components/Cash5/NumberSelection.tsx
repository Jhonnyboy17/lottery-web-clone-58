
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
  // Function to get digit display
  const getDigitDisplay = (index: number) => {
    const digit = currentLine.digits[index];
    return digit !== null ? digit.toString() : "?";
  };

  // Calculate positions for numbers in a wheel
  const getNumberPosition = (index: number, totalNumbers: number) => {
    // Arrange numbers in ascending order clockwise
    const angleOffset = -90; // Start from top (negative 90 degrees)
    const angleStep = 360 / totalNumbers;
    const angle = (index * angleStep + angleOffset) * (Math.PI / 180);
    
    // Radius - controls how far from center
    const radius = 100;
    
    // Calculate x and y positions
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Convert to percentage for styling
    return {
      top: `${50 + y}%`,
      left: `${50 + x}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="relative mb-6 mt-8">
      <div className="flex justify-center items-center h-48 relative">
        {/* Display current selection */}
        <div className="flex gap-2 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
          {currentLine.digits.map((digit, idx) => (
            <div 
              key={idx} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium border cursor-pointer ${
                activeDigitIndex === idx 
                  ? 'bg-blue-500 text-white' 
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
        
        {/* Numbers in a wheel from 0 to 9 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
          const position = getNumberPosition(number, 10);
          return (
            <button
              key={number}
              onClick={() => onDigitSelect(number)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium absolute"
              style={{
                ...position,
                backgroundColor: activeDigitIndex !== null && currentLine.digits[activeDigitIndex] === number 
                  ? '#0EA5E9' 
                  : '#dbeafe',
                color: activeDigitIndex !== null && currentLine.digits[activeDigitIndex] === number 
                  ? 'white' 
                  : '#1e40af'
              }}
            >
              {number}
            </button>
          );
        })}
        
        <div className="text-center">
          {activeDigitIndex !== null ? (
            <div className="text-3xl font-bold">?</div>
          ) : isLineComplete() ? (
            <div className="text-3xl font-bold">✓</div>
          ) : (
            <>
              <div className="text-sm font-medium">Select your first</div>
              <div className="text-sm font-medium">number</div>
              <div className="text-sm font-medium text-amber-500">to get started!</div>
            </>
          )}
        </div>
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
