
import { useState, useEffect } from "react";
import { NumberSelectionType } from "../types";

export function useDigitSelection(
  currentLine: NumberSelectionType,
  setCurrentLine: React.Dispatch<React.SetStateAction<NumberSelectionType>>,
  isEditing: boolean,
  handleAddLine: () => void
) {
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(0); // Start with first digit selected
  const [animatedProgress, setAnimatedProgress] = useState<number | null>(null);

  // Effect to auto-add line when complete
  useEffect(() => {
    if (isLineComplete() && !isEditing) {
      const timer = setTimeout(() => {
        handleAddLine();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine.digits, isEditing]);

  // Handle changing active digit index when playType changes
  useEffect(() => {
    if (currentLine.playType === "Back Pair") {
      // For Back Pair, first digit is disabled, so start with second digit
      if (activeDigitIndex === 0 || activeDigitIndex === null) {
        setActiveDigitIndex(1);
      }
    } else if (currentLine.playType === "Front Pair") {
      // For Front Pair, last digit is disabled, so start with first digit
      if (activeDigitIndex === 2 || activeDigitIndex === null) {
        setActiveDigitIndex(0);
      }
    } else if (activeDigitIndex === null && currentLine.digits.some(digit => digit === null)) {
      // For other play types, find the first empty digit
      const firstEmptyIndex = currentLine.digits.findIndex(digit => digit === null);
      if (firstEmptyIndex !== -1) {
        setActiveDigitIndex(firstEmptyIndex);
      }
    }
  }, [currentLine.playType, currentLine.digits, activeDigitIndex]);

  // Handle animation effect for progress bar
  useEffect(() => {
    if (animatedProgress !== null) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev !== null && prev < getProgressPercentage()) {
            return prev + 5;
          } else {
            clearInterval(interval);
            return getProgressPercentage();
          }
        });
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [animatedProgress]);

  const getProgressPercentage = () => {
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

  const handleDigitSelect = (digit: number) => {
    if (activeDigitIndex === null) return;
    
    // Skip first digit for Back Pair
    if (currentLine.playType === "Back Pair" && activeDigitIndex === 0) return;
    
    // Skip last digit for Front Pair
    if (currentLine.playType === "Front Pair" && activeDigitIndex === 2) return;
    
    const newDigits = [...currentLine.digits];
    newDigits[activeDigitIndex] = digit;
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    // Find next available digit
    let nextEmptyIndex = -1;
    
    if (currentLine.playType === "Back Pair") {
      // For Back Pair, only check digits 1 and 2
      for (let i = 1; i <= 2; i++) {
        if (i > activeDigitIndex && newDigits[i] === null) {
          nextEmptyIndex = i;
          break;
        }
      }
    } else if (currentLine.playType === "Front Pair") {
      // For Front Pair, only check digits 0 and 1
      for (let i = 0; i <= 1; i++) {
        if (i > activeDigitIndex && newDigits[i] === null) {
          nextEmptyIndex = i;
          break;
        }
      }
    } else {
      // For other play types, check all digits
      nextEmptyIndex = newDigits.findIndex((d, i) => d === null && i > activeDigitIndex);
    }
    
    if (nextEmptyIndex !== -1) {
      setActiveDigitIndex(nextEmptyIndex);
    } else {
      // If we're done entering digits, set to null
      setActiveDigitIndex(null);
    }
  };

  // Check if line is complete based on play type
  const isPairTypeLineComplete = () => {
    if (currentLine.playType === "Back Pair") {
      // For Back Pair, check if digits 1 and 2 are filled
      return currentLine.digits[1] !== null && currentLine.digits[2] !== null;
    } else if (currentLine.playType === "Front Pair") {
      // For Front Pair, check if digits 0 and 1 are filled
      return currentLine.digits[0] !== null && currentLine.digits[1] !== null;
    } else {
      // For other play types, check if all digits are filled
      return !currentLine.digits.some(digit => digit === null);
    }
  };

  const isLineComplete = () => {
    return isPairTypeLineComplete();
  };

  return {
    activeDigitIndex,
    animatedProgress,
    setActiveDigitIndex,
    handleDigitSelect,
    isLineComplete,
    getProgressPercentage,
    setAnimatedProgress
  };
}
