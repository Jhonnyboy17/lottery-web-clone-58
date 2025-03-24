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
  isEditing?: boolean;
  colorValue?: string;
}

const NumberSelection: React.FC<NumberSelectionProps> = ({
  activeDigitIndex,
  setActiveDigitIndex,
  currentLine,
  onDigitSelect,
  isLineComplete,
  onClearSelections,
  onAddLine,
  isEditing = false,
  colorValue = "#0EA5E9"
}) => {
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<number | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isEditingNumber, setIsEditingNumber] = useState(false);

  useEffect(() => {
    if (isLineComplete() && onAddLine && !clickedNumber && !isEditing) {
      const timer = setTimeout(() => {
        onAddLine();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine.digits, isLineComplete, onAddLine, clickedNumber, isEditing]);

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

  useEffect(() => {
    if (cooldownTime > 0) {
      const interval = setInterval(() => {
        setCooldownTime(prev => Math.max(0, prev - 1));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [cooldownTime]);
  
  useEffect(() => {
    if (activeDigitIndex !== null) {
      setIsEditingNumber(true);
    } else {
      const timer = setTimeout(() => {
        setIsEditingNumber(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activeDigitIndex]);

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
    if (isEditing) {
      return "Editar Números";
    } else if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
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
    if (isRandomizing) return;
    
    const filledCount = currentLine.digits.filter(digit => digit !== null && digit !== -1).length;
    
    let newCooldownTime = 4;
    if (filledCount === 3) newCooldownTime = 2;
    else if (filledCount === 2) newCooldownTime = 3;
    else if (filledCount === 1) newCooldownTime = 4;
    else if (filledCount === 0) newCooldownTime = 4;
    
    setCooldownTime(newCooldownTime);
    setIsRandomizing(true);
    setAnimatedProgress(getSelectionProgress());
    
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
    
    if (emptyPositions.length > 0) {
      emptyPositions.forEach((position, index) => {
        setTimeout(() => {
          const randomDigit = Math.floor(Math.random() * 10);
          onDigitSelect(randomDigit);
          
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

  const getNumberOpacity = (isSelected: boolean) => {
    if (isSelected) return 1; // Selected numbers always fully visible
    
    if (shouldDimUnselected) {
      // Full line complete - use 10% opacity
      return 0.1;
    }
    
    return 0.4; // Default 40% opacity
  }

  const selectionProgress = getSelectionProgress();
  const displayProgress = animatedProgress !== null ? animatedProgress : selectionProgress;
  
  const hasNoSelections = currentLine.digits.every(digit => digit === null);
  
  const lineComplete = isLineComplete();
  
  const shouldDimUnselected = lineComplete && !isEditingNumber && !isEditing;

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
              backgroundColor: colorValue 
            }}
          />
        </Progress>
      </div>
      
      <div className="flex justify-center items-center h-[220px] relative">
        <div className="grid grid-cols-5 gap-4 z-10">
          {[...Array(10).keys()].map((number) => {
            const isSelected = currentLine.digits.includes(number);
            const opacity = getNumberOpacity(isSelected);
            
            return (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium transition-colors duration-300`}
                style={{
                  backgroundColor: clickedNumber === number || isSelected
                    ? colorValue
                    : '#f5f5f5',
                  color: clickedNumber === number || isSelected
                    ? 'white'
                    : '#888888',
                  opacity: opacity
                }}
              >
                {number}
              </button>
            );
          })}
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
              style={{
                backgroundColor: isActive ? colorValue : isX ? '#e5e7eb' : digit === null ? '#f3f4f6' : '#dbeafe',
                color: isActive ? 'white' : isX ? '#4b5563' : digit === null ? '#9ca3af' : '#1e40af',
                borderColor: isActive ? colorValue : isX ? '#d1d5db' : '#e5e7eb'
              }}
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
          className="text-xs border"
          style={{
            color: colorValue,
            borderColor: colorValue,
            opacity: isRandomizing ? 0.5 : 1,
            cursor: isRandomizing ? 'not-allowed' : 'pointer'
          }}
          disabled={isRandomizing}
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
