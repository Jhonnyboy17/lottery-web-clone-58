
import React from "react";
import { Button } from "@/components/ui/button";
import TicketOptions from "./TicketOptions";
import NumberSelection from "./NumberSelection";
import { NumberSelectionType } from "./types";

interface CurrentLineSelectionProps {
  lineCount: number;
  currentLine: NumberSelectionType;
  activeDigitIndex: number | null;
  setActiveDigitIndex: (index: number | null) => void;
  playTypes: string[];
  betAmounts: string[];
  onQuickPick: () => void;
  onPlayTypeChange: (value: string) => void;
  onBetAmountChange: (value: string) => void;
  onDigitSelect: (digit: number) => void;
  isLineComplete: () => boolean; // This should be a function that returns a boolean
  onClearSelections: () => void;
  onAddLine: () => void;
  colorValue: string;
}

const CurrentLineSelection: React.FC<CurrentLineSelectionProps> = ({
  lineCount,
  currentLine,
  activeDigitIndex,
  setActiveDigitIndex,
  playTypes,
  betAmounts,
  onQuickPick,
  onPlayTypeChange,
  onBetAmountChange,
  onDigitSelect,
  isLineComplete,
  onClearSelections,
  onAddLine,
  colorValue
}) => {
  return (
    <div className="p-3">
      <TicketOptions 
        lineCount={lineCount} 
        currentLine={currentLine}
        playTypes={playTypes}
        betAmounts={betAmounts}
        onQuickPick={onQuickPick}
        onPlayTypeChange={onPlayTypeChange}
        onBetAmountChange={onBetAmountChange}
      />

      <NumberSelection 
        activeDigitIndex={activeDigitIndex}
        setActiveDigitIndex={setActiveDigitIndex}
        currentLine={currentLine}
        onDigitSelect={onDigitSelect}
        isLineComplete={isLineComplete}
        onClearSelections={onClearSelections}
      />

      <Button 
        onClick={onAddLine} 
        disabled={!isLineComplete()}
        className="w-full hover:bg-opacity-90 mt-2"
        style={{ backgroundColor: colorValue }}
      >
        ADICIONAR LINHA
      </Button>
    </div>
  );
};

export default CurrentLineSelection;
