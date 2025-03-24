
import React, { useEffect, useState } from "react";
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
  onAddLine?: () => void;
}

const NumberSelection: React.FC<NumberSelectionProps> = ({
  activeDigitIndex,
  setActiveDigitIndex,
  currentLine,
  onDigitSelect,
  isLineComplete,
  onClearSelections,
  onAddLine
}) => {
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<number | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    if (isLineComplete() && onAddLine) {
      const timer = setTimeout(() => {
        onAddLine();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine.digits, isLineComplete, onAddLine]);

  useEffect(() => {
    if (animatedProgress !== null) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          const targetProgress = getSelectionProgress();
          if (prev !== null && prev < targetProgress) {
            return prev + 5;
          } else {
            clearInterval(interval);
            return targetProgress;
          }
        });
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [animatedProgress]);
  
  useEffect(() => {
    if (currentLine.playType === "Back Pair") {
      if (currentLine.digits[1] === null) {
        setActiveDigitIndex(1);
      } else if (currentLine.digits[2] === null) {
        setActiveDigitIndex(2);
      }
    } else if (currentLine.playType === "Front Pair") {
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

  // Effect for cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const interval = setInterval(() => {
        setCooldownTime(prev => Math.max(0, prev - 1));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [cooldownTime]);

  const handleNumberClick = (digit: number) => {
    setClickedNumber(digit);
    onDigitSelect(digit);
    
    setTimeout(() => {
      setClickedNumber(null);
    }, 2000);
  };

  const getDigitDisplay = (index: number) => {
    const digit = currentLine.digits[index];
    
    if (digit === -1) {
      return "X";
    }
    
    return digit !== null ? digit.toString() : "?";
  };

  const isDigitDisabled = (index: number) => {
    return (currentLine.playType === "Back Pair" && index === 0) || 
           (currentLine.playType === "Front Pair" && index === 2);
  };
  
  const getHeadingText = () => {
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      return "Escolha 2 Números";
    }
    return "Escolha 3 Números";
  };

  const getSelectionProgress = () => {
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      const countFilled = currentLine.digits.filter(digit => digit !== null && digit !== -1).length;
      return (countFilled / 2) * 100;
    } else {
      const countFilled = currentLine.digits.filter(digit => digit !== null).length;
      return (countFilled / 3) * 100;
    }
  };

  const handleRandomPick = () => {
    if (isRandomizing || cooldownTime > 0) return;
    
    const filledCount = currentLine.digits.filter(digit => digit !== null && digit !== -1).length;
    
    // Set cooldown based on filled numbers
    let newCooldownTime = 4; // Default cooldown
    if (filledCount === 3) newCooldownTime = 2;
    else if (filledCount === 2) newCooldownTime = 3;
    else if (filledCount === 1) newCooldownTime = 4;
    else if (filledCount === 0) newCooldownTime = 4;
    
    setCooldownTime(newCooldownTime);
    setIsRandomizing(true);
    setAnimatedProgress(getSelectionProgress());
    
    // Identify empty positions based on play type
    let emptyPositions: number[] = [];
    
    if (currentLine.playType === "Back Pair") {
      if (currentLine.digits[1] === null) emptyPositions.push(1);
      if (currentLine.digits[2] === null) emptyPositions.push(2);
    } else if (currentLine.playType === "Front Pair") {
      if (currentLine.digits[0] === null) emptyPositions.push(0);
      if (currentLine.digits[1] === null) emptyPositions.push(1);
    } else {
      currentLine.digits.forEach((digit, index) => {
        if (digit === null) emptyPositions.push(index);
      });
    }
    
    // Generate random numbers one by one with delays
    if (emptyPositions.length > 0) {
      emptyPositions.forEach((position, index) => {
        setTimeout(() => {
          const randomDigit = Math.floor(Math.random() * 10);
          onDigitSelect(randomDigit);
          
          // When last number is generated, end randomizing state
          if (index === emptyPositions.length - 1) {
            setTimeout(() => {
              setIsRandomizing(false);
            }, 500);
          }
        }, index * 400);
      });
    } else {
      setIsRandomizing(false);
    }
  };

  const selectionProgress = getSelectionProgress();
  const displayProgress = animatedProgress !== null ? animatedProgress : selectionProgress;

  return (
    <div className="relative mb-6 mt-8">
      <h2 className="text-center text-xl font-semibold mb-4 text-blue-800">
        {getHeadingText()}
      </h2>
      
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Progresso da seleção</p>
        <span className="text-xs font-medium">{Math.round(selectionProgress)}%</span>
      </div>
      
      <div className="mb-3">
        <Progress 
          value={displayProgress} 
          className="h-2"
          style={{ backgroundColor: "#e5e7eb" }}
        >
          <div 
            className="h-full transition-all" 
            style={{ 
              width: `${displayProgress}%`,
              backgroundColor: "#0EA5E9" 
            }}
          />
        </Progress>
      </div>
      
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
      
      <div className="flex justify-between mt-2">
        <Button 
          onClick={handleRandomPick}
          variant="outline" 
          className={`text-xs text-blue-500 border-blue-500 ${isRandomizing ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isRandomizing || cooldownTime > 0}
        >
          Jogada Aleatória
        </Button>
        
        <Button 
          onClick={onClearSelections}
          variant="link" 
          className="text-xs text-gray-500"
          disabled={isRandomizing}
        >
          Limpar seleções
        </Button>
      </div>
    </div>
  );
};

export default NumberSelection;
