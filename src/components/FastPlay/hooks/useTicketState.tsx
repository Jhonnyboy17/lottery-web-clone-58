
import { useState } from "react";
import { NumberSelectionType } from "../types";
import { useDigitSelection } from "./useDigitSelection";
import { useLineOptions } from "./useLineOptions";
import { useSavedLines } from "./useSavedLines";

export const useTicketState = () => {
  const [currentLine, setCurrentLine] = useState<NumberSelectionType>({
    digits: [null, null, null], // 3 digits for FastPlay
    playType: "Straight", 
    betAmount: "R$8",
    includeFireball: false,
    drawCount: "1"
  });
  
  // Get saved lines functionality
  const {
    savedLines,
    lineCount,
    isEditing,
    editingIndex,
    handleAddLine: addLine,
    handleRemoveLine: removeLine,
    handleEditLine: editLine,
    getTicketPrice
  } = useSavedLines();

  // This function will be passed to hooks that need to reset the current line
  const resetCurrentLine = () => {
    // Initialize with appropriate values based on play type
    let newDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      newDigits[0] = -1; // Set first digit as "X" for Back Pair
    } else if (currentLine.playType === "Front Pair") {
      newDigits[2] = -1; // Set last digit as "X" for Front Pair
    }
    
    setCurrentLine({
      digits: newDigits,
      playType: currentLine.playType,
      betAmount: currentLine.betAmount,
      includeFireball: false,
      drawCount: "1"
    });
    
    // Reset animation
    digitSelection.setAnimatedProgress(0);
  };

  // Get digit selection functionality
  const digitSelection = useDigitSelection(
    currentLine, 
    setCurrentLine, 
    isEditing,
    () => addLine(currentLine, resetCurrentLine)
  );

  // Get line options functionality
  const lineOptions = useLineOptions(
    currentLine, 
    setCurrentLine, 
    digitSelection.setActiveDigitIndex,
    digitSelection.setAnimatedProgress
  );

  // Wrapper functions to provide the needed parameters
  const handleAddLine = () => addLine(currentLine, resetCurrentLine);
  
  const handleRemoveLine = (lineIndex: number) => {
    removeLine(lineIndex, lineOptions.clearSelections);
  };

  const handleEditLine = (lineIndex: number) => {
    editLine(lineIndex, setCurrentLine);
    digitSelection.setActiveDigitIndex(null); // Don't focus any digit initially when editing
  };

  return {
    currentLine,
    savedLines,
    lineCount,
    activeDigitIndex: digitSelection.activeDigitIndex,
    isEditing,
    editingIndex,
    animatedProgress: digitSelection.animatedProgress,
    setActiveDigitIndex: digitSelection.setActiveDigitIndex,
    handleDigitSelect: digitSelection.handleDigitSelect,
    handlePlayTypeChange: lineOptions.handlePlayTypeChange,
    handleBetAmountChange: lineOptions.handleBetAmountChange,
    handleQuickPick: lineOptions.handleQuickPick,
    clearSelections: lineOptions.clearSelections,
    handleAddLine,
    handleRemoveLine,
    handleEditLine,
    isLineComplete: digitSelection.isLineComplete,
    getTicketPrice,
    getProgressPercentage: digitSelection.getProgressPercentage
  };
};
