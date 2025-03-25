
import { useState, useEffect } from "react";
import { NumberSelectionType } from "../types";

export const useTicketState = () => {
  const [currentLine, setCurrentLine] = useState<NumberSelectionType>({
    digits: [null, null, null],
    playType: "Straight", 
    betAmount: "R$8",
    includeFireball: false,
    drawCount: "1"
  });
  
  const [savedLines, setSavedLines] = useState<NumberSelectionType[]>([]);
  const [lineCount, setLineCount] = useState(1);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Effect for animating selection
  useEffect(() => {
    if (isLineComplete() && !isEditing) {
      const timer = setTimeout(() => {
        handleAddLine();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine.digits]);

  const handleDigitSelect = (digit: number) => {
    if (activeDigitIndex === null) return;
    
    const newDigits = [...currentLine.digits];
    newDigits[activeDigitIndex] = digit;
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    // Find next empty digit
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
    // Always create fresh random numbers regardless of editing state
    // Clear the current selection first
    const emptyDigits = [null, null, null];
    
    // Apply empty digits first to clear the UI
    setCurrentLine({
      ...currentLine,
      digits: emptyDigits
    });
    
    // Generate random digits
    const randomDigits = Array(3).fill(0).map(() => Math.floor(Math.random() * 10));
    
    // Set the random digits
    setCurrentLine({
      ...currentLine,
      digits: randomDigits
    });
    
    // Clear focus
    setActiveDigitIndex(null);
    
    // If we're editing, update the saved line immediately
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
    setCurrentLine({
      ...currentLine,
      digits: [null, null, null]
    });
    
    setActiveDigitIndex(0);
  };

  const handleAddLine = () => {
    if (!isLineComplete()) return;
    
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
    
    // Reset current line
    setCurrentLine({
      digits: [null, null, null],
      playType: currentLine.playType,
      betAmount: currentLine.betAmount,
      includeFireball: false,
      drawCount: "1"
    });
    
    setActiveDigitIndex(0);
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
    
    // If removing the line we're currently editing, cancel editing
    if (isEditing && editingIndex === lineIndex) {
      setIsEditing(false);
      setEditingIndex(null);
      clearSelections();
    }
  };

  const handleEditLine = (lineIndex: number) => {
    // If we're already editing a line, save those changes first
    if (isEditing && editingIndex !== null) {
      const updatedLines = [...savedLines];
      updatedLines[editingIndex] = {...currentLine};
      setSavedLines(updatedLines);
    }
    
    const lineToEdit = savedLines[lineIndex];
    if (!lineToEdit) return;
    
    // Set current line to the selected line for editing
    setCurrentLine({...lineToEdit});
    setIsEditing(true);
    setEditingIndex(lineIndex);
    setActiveDigitIndex(null); // Don't focus any digit initially when editing
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
    getTicketPrice,
    isEditing,
    editingIndex,
    setIsEditing,
    setEditingIndex
  };
};
