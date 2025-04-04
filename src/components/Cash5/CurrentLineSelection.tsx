
import React from "react";
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
  isLineComplete: () => boolean;
  onClearSelections: () => void;
  onAddLine: () => void;
  isEditing: boolean;
  editingIndex: number | null;
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
  isEditing,
  editingIndex,
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
        onAddLine={onAddLine}
        isEditing={isEditing}
        colorValue={colorValue}
        onQuickPick={onQuickPick}
      />
    </div>
  );
};

export default CurrentLineSelection;
