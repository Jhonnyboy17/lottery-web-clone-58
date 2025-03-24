
import { useState } from "react";
import { NumberSelectionType } from "../types";

export function useSavedLines() {
  const [savedLines, setSavedLines] = useState<NumberSelectionType[]>([]);
  const [lineCount, setLineCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddLine = (currentLine: NumberSelectionType, resetCurrentLine: () => void) => {
    // Check if line is complete
    if (!isPairTypeLineComplete(currentLine)) return;
    
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
    resetCurrentLine();
  };

  const handleRemoveLine = (lineIndex: number, clearSelections: () => void) => {
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

  const handleEditLine = (lineIndex: number, setCurrentLine: (line: NumberSelectionType) => void) => {
    // If lineIndex is -1, it's just a trigger to re-render
    if (lineIndex === -1) return;
    
    const lineToEdit = savedLines[lineIndex];
    if (!lineToEdit) return;
    
    setCurrentLine({...lineToEdit});
    setIsEditing(true);
    setEditingIndex(lineIndex);
  };

  // Check if line is complete based on play type
  const isPairTypeLineComplete = (line: NumberSelectionType) => {
    if (line.playType === "Back Pair") {
      // For Back Pair, check if digits 1 and 2 are filled
      return line.digits[1] !== null && line.digits[2] !== null;
    } else if (line.playType === "Front Pair") {
      // For Front Pair, check if digits 0 and 1 are filled
      return line.digits[0] !== null && line.digits[1] !== null;
    } else {
      // For other play types, check if all digits are filled
      return !line.digits.some(digit => digit === null);
    }
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
    savedLines,
    lineCount,
    isEditing,
    editingIndex,
    handleAddLine,
    handleRemoveLine,
    handleEditLine,
    getTicketPrice
  };
}
