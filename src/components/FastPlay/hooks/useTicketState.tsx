
import { useState, useEffect } from "react";
import { NumberSelectionType } from "../../Cash5/types";

export const useTicketState = () => {
  const [currentLine, setCurrentLine] = useState<NumberSelectionType>({
    digits: [null, null, null], // 3 digits for FastPlay
    playType: "Straight", 
    betAmount: "R$8"
  });
  
  const [savedLines, setSavedLines] = useState<NumberSelectionType[]>([]);
  const [lineCount, setLineCount] = useState(1);
  const [includeFireball, setIncludeFireball] = useState(false);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(0); // Start with first digit selected
  const [selectedDrawTime, setSelectedDrawTime] = useState("both");
  const [selectedDrawCount, setSelectedDrawCount] = useState("1");

  // Ensure that the first empty index is selected when needed
  useEffect(() => {
    if (activeDigitIndex === null && currentLine.digits.some(digit => digit === null)) {
      const firstEmptyIndex = currentLine.digits.findIndex(digit => digit === null);
      if (firstEmptyIndex !== -1) {
        setActiveDigitIndex(firstEmptyIndex);
      }
    }
  }, [currentLine.digits, activeDigitIndex]);

  const handleDigitSelect = (digit: number) => {
    if (activeDigitIndex === null) return;
    
    const newDigits = [...currentLine.digits];
    newDigits[activeDigitIndex] = digit;
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    const nextEmptyIndex = newDigits.findIndex((d, i) => d === null && i > activeDigitIndex);
    if (nextEmptyIndex !== -1) {
      setActiveDigitIndex(nextEmptyIndex);
    } else {
      setActiveDigitIndex(null);
    }
  };

  const handlePlayTypeChange = (value: string) => {
    setCurrentLine({
      ...currentLine,
      playType: value
    });
  };

  const handleBetAmountChange = (value: string) => {
    setCurrentLine({
      ...currentLine,
      betAmount: value
    });
  };

  const handleQuickPick = () => {
    const randomDigits = Array(3).fill(0).map(() => 
      Math.floor(Math.random() * 10)
    );
    
    setCurrentLine({
      ...currentLine,
      digits: randomDigits
    });
    
    setActiveDigitIndex(null);
  };

  const clearSelections = () => {
    setCurrentLine({
      ...currentLine,
      digits: [null, null, null]
    });
    setActiveDigitIndex(0);
  };

  const handleAddLine = () => {
    if (currentLine.digits.some(digit => digit === null)) return;
    
    setSavedLines([...savedLines, {...currentLine}]);
    setLineCount(lineCount + 1);
    
    setCurrentLine({
      digits: [null, null, null],
      playType: currentLine.playType,
      betAmount: currentLine.betAmount
    });
    
    setActiveDigitIndex(0);
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
    // Decrease the line count when a line is removed
    if (lineCount > 1) {
      setLineCount(lineCount - 1);
    }
  };

  const isLineComplete = () => {
    return !currentLine.digits.some(digit => digit === null);
  };

  const getTicketPrice = () => {
    const calculateLinePrice = (line: NumberSelectionType) => {
      // Extract the numeric value from the bet amount string and parse it
      const amount = parseFloat(line.betAmount.replace('R$', ''));
      return amount;
    };

    // Calculate base price
    const totalBasePrice = savedLines.reduce((sum, line) => sum + calculateLinePrice(line), 0);
    const fireballPrice = includeFireball ? savedLines.length * 1 : 0;
    
    // Multiply by the number of draws
    const numberOfDraws = parseInt(selectedDrawCount);
    const totalPrice = (totalBasePrice + fireballPrice) * numberOfDraws;
    
    return totalPrice.toFixed(2);
  };

  return {
    currentLine,
    savedLines,
    lineCount,
    includeFireball,
    activeDigitIndex,
    selectedDrawTime,
    selectedDrawCount,
    setActiveDigitIndex,
    handleDigitSelect,
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections,
    handleAddLine,
    handleRemoveLine,
    setIncludeFireball,
    setSelectedDrawTime,
    setSelectedDrawCount,
    isLineComplete,
    getTicketPrice
  };
};
