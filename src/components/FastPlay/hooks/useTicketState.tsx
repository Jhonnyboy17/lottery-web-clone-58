import { useState, useEffect } from "react";
import { NumberSelectionType } from "../../Cash5/types";

export const useTicketState = () => {
  const [currentLine, setCurrentLine] = useState<NumberSelectionType>({
    digits: [null, null, null], // 3 digits for FastPlay
    playType: "Straight", 
    betAmount: "R$8",
    includeFireball: false,
    drawCount: "1"
  });
  
  const [savedLines, setSavedLines] = useState<NumberSelectionType[]>([]);
  const [lineCount, setLineCount] = useState(1);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(0); // Start with first digit selected
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<number | null>(null);

  useEffect(() => {
    if (isLineComplete() && !isEditing) {
      const timer = setTimeout(() => {
        handleAddLine();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine.digits]);

  useEffect(() => {
    if (currentLine.playType === "Back Pair") {
      if (activeDigitIndex === 0 || activeDigitIndex === null) {
        setActiveDigitIndex(1);
      }
    } else if (currentLine.playType === "Front Pair") {
      if (activeDigitIndex === 2 || activeDigitIndex === null) {
        setActiveDigitIndex(0);
      }
    } else if (activeDigitIndex === null && currentLine.digits.some(digit => digit === null)) {
      const firstEmptyIndex = currentLine.digits.findIndex(digit => digit === null);
      if (firstEmptyIndex !== -1) {
        setActiveDigitIndex(firstEmptyIndex);
      }
    }
  }, [currentLine.playType, currentLine.digits, activeDigitIndex]);

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
      const filledCount = currentLine.digits.filter(d => d !== null && d !== -1).length;
      return (filledCount / 2) * 100;
    } else {
      const filledCount = currentLine.digits.filter(d => d !== null).length;
      return (filledCount / 3) * 100;
    }
  };

  const handleDigitSelect = (digit: number) => {
    if (activeDigitIndex === null) return;
    
    if (currentLine.playType === "Back Pair" && activeDigitIndex === 0) return;
    if (currentLine.playType === "Front Pair" && activeDigitIndex === 2) return;
    
    const newDigits = [...currentLine.digits];
    newDigits[activeDigitIndex] = digit;
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    let nextEmptyIndex = -1;
    
    if (currentLine.playType === "Back Pair") {
      for (let i = 1; i <= 2; i++) {
        if (i > activeDigitIndex && newDigits[i] === null) {
          nextEmptyIndex = i;
          break;
        }
      }
    } else if (currentLine.playType === "Front Pair") {
      for (let i = 0; i <= 1; i++) {
        if (i > activeDigitIndex && newDigits[i] === null) {
          nextEmptyIndex = i;
          break;
        }
      }
    } else {
      nextEmptyIndex = newDigits.findIndex((d, i) => d === null && i > activeDigitIndex);
    }
    
    if (nextEmptyIndex !== -1) {
      setActiveDigitIndex(nextEmptyIndex);
    } else {
      setActiveDigitIndex(null);
    }
  };

  const handlePlayTypeChange = (value: string) => {
    const newPlayType = value;
    let newDigits = [...currentLine.digits];
    
    if ((currentLine.playType !== "Back Pair" && currentLine.playType !== "Front Pair") && 
        (newPlayType === "Back Pair" || newPlayType === "Front Pair")) {
      newDigits = [null, null, null];
    } else if ((currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") && 
               (newPlayType !== "Back Pair" && newPlayType !== "Front Pair")) {
      newDigits = [null, null, null];
    }
    
    if (newPlayType === "Back Pair") {
      newDigits[0] = -1;
      setActiveDigitIndex(1);
    } else if (newPlayType === "Front Pair") {
      newDigits[2] = -1;
      setActiveDigitIndex(0);
    } else if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      newDigits = [null, null, null];
      setActiveDigitIndex(0);
    }
    
    setCurrentLine({
      ...currentLine,
      playType: newPlayType,
      digits: newDigits
    });
  };

  const handleBetAmountChange = (value: string) => {
    setCurrentLine({
      ...currentLine,
      betAmount: value
    });
  };

  const handleQuickPick = () => {
    setAnimatedProgress(getProgressPercentage());
    
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1;
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1;
    }
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    let randomDigits = [...newDigits];
    
    if (currentLine.playType === "Back Pair") {
      randomDigits[1] = Math.floor(Math.random() * 10);
      randomDigits[2] = Math.floor(Math.random() * 10);
    } else if (currentLine.playType === "Front Pair") {
      randomDigits[0] = Math.floor(Math.random() * 10);
      randomDigits[1] = Math.floor(Math.random() * 10);
    } else {
      randomDigits = Array(3).fill(0).map(() => Math.floor(Math.random() * 10));
    }
    
    setCurrentLine({
      ...currentLine,
      digits: randomDigits
    });
    
    setActiveDigitIndex(null);
    
    if (isEditing && editingIndex !== null) {
      const updatedLines = [...savedLines];
      updatedLines[editingIndex] = {
        ...currentLine,
        digits: randomDigits
      };
      setSavedLines(updatedLines);
    }
  };

  const clearSelections = () => {
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1;
      setActiveDigitIndex(1);
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1;
      setActiveDigitIndex(0);
    } else {
      setActiveDigitIndex(0);
    }
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    setAnimatedProgress(0);
  };

  const handleAddLine = () => {
    if (!isPairTypeLineComplete()) return;
    
    if (isEditing && editingIndex !== null) {
      const updatedLines = [...savedLines];
      updatedLines[editingIndex] = {...currentLine};
      setSavedLines(updatedLines);
      
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setSavedLines([...savedLines, {...currentLine}]);
      setLineCount(lineCount + 1);
    }
    
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1;
      setActiveDigitIndex(1);
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1;
      setActiveDigitIndex(0);
    } else {
      setActiveDigitIndex(0);
    }
    
    setCurrentLine({
      digits: newDigits,
      playType: currentLine.playType,
      betAmount: currentLine.betAmount,
      includeFireball: false,
      drawCount: "1"
    });
    
    setAnimatedProgress(0);
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
    if (lineCount > 1) {
      setLineCount(lineCount - 1);
    }
    
    if (isEditing && editingIndex === lineIndex) {
      setIsEditing(false);
      setEditingIndex(null);
      clearSelections();
    }
  };

  const handleEditLine = (lineIndex: number) => {
    if (lineIndex === -1) return;
    
    if (isEditing && editingIndex !== null) {
      const currentUpdatedLines = [...savedLines];
      currentUpdatedLines[editingIndex] = {...currentLine};
      setSavedLines(currentUpdatedLines);
    }
    
    const lineToEdit = savedLines[lineIndex];
    if (!lineToEdit) return;
    
    setCurrentLine({...lineToEdit});
    setIsEditing(true);
    setEditingIndex(lineIndex);
    setActiveDigitIndex(null);
    setAnimatedProgress(100);
  };

  const isPairTypeLineComplete = () => {
    if (currentLine.playType === "Back Pair") {
      return currentLine.digits[1] !== null && currentLine.digits[2] !== null;
    } else if (currentLine.playType === "Front Pair") {
      return currentLine.digits[0] !== null && currentLine.digits[1] !== null;
    } else {
      return isLineComplete();
    }
  };

  const isLineComplete = () => {
    return !currentLine.digits.some(digit => digit === null);
  };

  const getTicketPrice = () => {
    const calculateLinePrice = (line: NumberSelectionType) => {
      const amount = parseFloat(line.betAmount.replace('R$', ''));
      const fireballAmount = line.includeFireball ? 1 : 0;
      const drawCount = parseInt(line.drawCount || "1");
      
      return (amount + fireballAmount) * drawCount;
    };
    
    const totalPrice = savedLines.reduce((sum, line) => sum + calculateLinePrice(line), 0);
    
    return totalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace('R$', 'R$ ');
  };

  return {
    currentLine,
    savedLines,
    lineCount,
    activeDigitIndex,
    setActiveDigitIndex,
    handleDigitSelect,
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections,
    handleAddLine,
    handleRemoveLine,
    handleEditLine,
    isLineComplete,
    isPairTypeLineComplete,
    getTicketPrice,
    isEditing,
    editingIndex,
    setIsEditing,
    setEditingIndex,
    animatedProgress,
    setAnimatedProgress
  };
};
