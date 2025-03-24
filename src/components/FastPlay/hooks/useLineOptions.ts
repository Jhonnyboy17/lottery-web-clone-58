import { NumberSelectionType } from "../types";

export function useLineOptions(
  currentLine: NumberSelectionType,
  setCurrentLine: React.Dispatch<React.SetStateAction<NumberSelectionType>>,
  setActiveDigitIndex: (index: number | null) => void,
  setAnimatedProgress: (value: number | null) => void
) {
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
    // Start animation from current progress
    setAnimatedProgress(0);
    
    let randomDigits = [null, null, null];
    
    if (currentLine.playType === "Back Pair") {
      // For Back Pair, keep any existing digit selections
      randomDigits = [...currentLine.digits];
      
      // Fill in any missing digits in positions 1 and 2
      if (randomDigits[1] === null) {
        randomDigits[1] = Math.floor(Math.random() * 10);
      }
      if (randomDigits[2] === null) {
        randomDigits[2] = Math.floor(Math.random() * 10);
      }
      
      // Ensure position 0 is set to -1 (X)
      randomDigits[0] = -1;
    } else if (currentLine.playType === "Front Pair") {
      // For Front Pair, keep any existing digit selections
      randomDigits = [...currentLine.digits];
      
      // Fill in any missing digits in positions 0 and 1
      if (randomDigits[0] === null) {
        randomDigits[0] = Math.floor(Math.random() * 10);
      }
      if (randomDigits[1] === null) {
        randomDigits[1] = Math.floor(Math.random() * 10);
      }
      
      // Ensure position 2 is set to -1 (X)
      randomDigits[2] = -1;
    } else {
      // For other play types, keep any existing digit selections
      randomDigits = [...currentLine.digits];
      
      // Fill in any missing digits
      for (let i = 0; i < randomDigits.length; i++) {
        if (randomDigits[i] === null) {
          randomDigits[i] = Math.floor(Math.random() * 10);
        }
      }
    }
    
    setCurrentLine({
      ...currentLine,
      digits: randomDigits
    });
    
    setActiveDigitIndex(null);
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

  return {
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections
  };
}
