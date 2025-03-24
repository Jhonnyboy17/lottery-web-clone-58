
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

      {isEditing && editingIndex !== null && (
        <div className="text-sm font-medium p-1 px-2 bg-amber-100 text-amber-800 rounded mb-3">
          Editando Linha {editingIndex + 1} - Clique em novos números para substituir
        </div>
      )}

      <NumberSelection 
        activeDigitIndex={activeDigitIndex}
        setActiveDigitIndex={setActiveDigitIndex}
        currentLine={currentLine}
        onDigitSelect={onDigitSelect}
        isLineComplete={isLineComplete}
        onClearSelections={onClearSelections}
        isEditing={isEditing}
        colorValue={colorValue}
      />
    </div>
  );
};

export default CurrentLineSelection;
