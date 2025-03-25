
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

  // Effect to auto-add line when complete
  useEffect(() => {
    if (isLineComplete() && !isEditing) {
      const timer = setTimeout(() => {
        handleAddLine();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine.digits]);

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

  const handlePlayTypeChange = (value: string) => {
    const newPlayType = value;
    let newDigits = [...currentLine.digits];
    
    // Reset digits when switching between pair types and other types
    if ((currentLine.playType !== "Back Pair" && currentLine.playType !== "Front Pair") && 
        (newPlayType === "Back Pair" || newPlayType === "Front Pair")) {
      newDigits = [null, null, null];
    } else if ((currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") && 
               (newPlayType !== "Back Pair" && newPlayType !== "Front Pair")) {
      newDigits = [null, null, null];
    }
    
    // Set the first digit to "X" (represented as -1) for Back Pair
    if (newPlayType === "Back Pair") {
      newDigits[0] = -1; // Using -1 to represent "X"
      setActiveDigitIndex(1);
    } 
    // Set the last digit to "X" for Front Pair
    else if (newPlayType === "Front Pair") {
      newDigits[2] = -1; // Using -1 to represent "X"
      setActiveDigitIndex(0);
    } 
    // Reset all digits to null when switching from a pair type to a non-pair type
    else if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
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
    // Important: First set animation from current progress
    setAnimatedProgress(getProgressPercentage());
    
    // Always clear the current line before generating new random numbers
    // Initialize new digits based on the current play type
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1; // Set first digit as "X" for Back Pair
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1; // Set last digit as "X" for Front Pair
    }
    
    // Apply the initial digit layout first
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    // Now generate random digits based on the play type
    let randomDigits = [...newDigits];
    
    if (currentLine.playType === "Back Pair") {
      // For Back Pair, generate random digits for positions 1 and 2
      randomDigits[1] = Math.floor(Math.random() * 10);
      randomDigits[2] = Math.floor(Math.random() * 10);
    } else if (currentLine.playType === "Front Pair") {
      // For Front Pair, generate random digits for positions 0 and 1
      randomDigits[0] = Math.floor(Math.random() * 10);
      randomDigits[1] = Math.floor(Math.random() * 10);
    } else {
      // For other play types, generate random digits for all positions
      randomDigits = Array(3).fill(0).map(() => Math.floor(Math.random() * 10));
    }
    
    // Update with the new random digits
    setCurrentLine({
      ...currentLine,
      digits: randomDigits
    });
    
    // No need to focus on any digit after quick pick
    setActiveDigitIndex(null);
    
    // If we're editing, immediately update the saved line
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
    // Initialize with appropriate values based on play type
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1; // Set first digit as "X" for Back Pair
      setActiveDigitIndex(1);
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1; // Set last digit as "X" for Front Pair
      setActiveDigitIndex(0);
    } else {
      setActiveDigitIndex(0);
    }
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    // Reset animation
    setAnimatedProgress(0);
  };

  const handleAddLine = () => {
    // Check if line is complete based on play type
    if (!isPairTypeLineComplete()) return;
    
    if (isEditing && editingIndex !== null) {
      // Update existing line
      const updatedLines = [...savedLines];
      updatedLines[editingIndex] = {...currentLine};
      setSavedLines(updatedLines);
      
      // Reset editing state
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      // Add new line
      setSavedLines([...savedLines, {...currentLine}]);
      setLineCount(lineCount + 1);
    }
    
    // Reset with appropriate values based on play type
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1; // Set first digit as "X" for Back Pair
      setActiveDigitIndex(1);
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1; // Set last digit as "X" for Front Pair
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
    
    // Reset animation
    setAnimatedProgress(0);
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
    // Decrease the line count when a line is removed
    if (lineCount > 1) {
      setLineCount(lineCount - 1);
    }
    
    // If removing the line we're currently editing, cancel editing
    if (isEditing && editingIndex === lineIndex) {
      setIsEditing(false);
      setEditingIndex(null);
      clearSelections();
    }
  };

  const handleEditLine = (lineIndex: number) => {
    // If lineIndex is -1, it's just a trigger to re-render
    if (lineIndex === -1) return;
    
    // Cancel any previous editing
    if (isEditing && editingIndex !== null) {
      // If we're already editing a line, we should apply those changes first
      const currentUpdatedLines = [...savedLines];
      currentUpdatedLines[editingIndex] = {...currentLine};
      setSavedLines(currentUpdatedLines);
    }
    
    const lineToEdit = savedLines[lineIndex];
    if (!lineToEdit) return;
    
    // Set current line to the selected line for editing
    setCurrentLine({...lineToEdit});
    setIsEditing(true);
    setEditingIndex(lineIndex);
    setActiveDigitIndex(null); // Don't focus any digit initially when editing
  };

  const handleToggleExtraPlay = (lineIndex: number, checked: boolean) => {
    const updatedLines = [...savedLines];
    updatedLines[lineIndex].includeFireball = checked;
    setSavedLines(updatedLines);
  };

  const handleChangeDrawCount = (lineIndex: number, count: string) => {
    const updatedLines = [...savedLines];
    updatedLines[lineIndex].drawCount = count;
    setSavedLines(updatedLines);
  };

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

  const getTicketPrice = () => {
    const calculateLinePrice = (line: NumberSelectionType) => {
      // Extract the numeric value from the bet amount string and parse it
      const amount = parseFloat(line.betAmount.replace('R$', ''));
      const fireballAmount = line.includeFireball ? 1 : 0;
      const drawCount = parseInt(line.drawCount || "1");
      
      return (amount + fireballAmount) * drawCount;
    };

    // Calculate total price for all lines
    const totalPrice = savedLines.reduce((sum, line) => sum + calculateLinePrice(line), 0);
    
    // Format as BRL
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
    isEditing,
    editingIndex,
    animatedProgress,
    setActiveDigitIndex,
    setIsEditing,
    setEditingIndex,
    handleDigitSelect,
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections,
    handleAddLine,
    handleRemoveLine,
    handleEditLine,
    isLineComplete,
    getTicketPrice,
    getProgressPercentage,
    handleToggleExtraPlay,
    handleChangeDrawCount
  };
};
