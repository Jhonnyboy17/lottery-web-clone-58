
import React from "react";
import { Card } from "@/components/ui/card";
import GameHeader from "../Cash5/GameHeader";
import CurrentLineSelection from "../Cash5/CurrentLineSelection";
import SavedLinesSection from "../Cash5/SavedLinesSection";
import TotalSummary from "../Cash5/TotalSummary";
import { useTicketState } from "./hooks/useTicketState";
import Navbar from "@/components/Navbar";

interface FastPlayPageProps {
  logoSrc: string;
  jackpotAmount: string;
  basePrice: number;
  primaryColor: string;
  gameName: string;
  extraPlayName?: string;
}

export const FastPlayPage = ({
  logoSrc,
  jackpotAmount,
  basePrice,
  primaryColor,
  gameName,
  extraPlayName = "Fast Boost",
}: FastPlayPageProps) => {
  const playTypes = ["Back Pair", "Box", "Combo", "Front Pair", "Straight", "Straight/Box"];
  const betAmounts = ["R$8", "R$15", "R$21", "R$28", "R$35"];
  
  const {
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
    handleToggleExtraPlay,
    handleChangeDrawCount
  } = useTicketState();

  const getColorValue = () => {
    switch (primaryColor) {
      case "amber-500":
        return "#f59e0b"; // Amber for Fast Play
      default:
        return "#f59e0b"; // Default to amber
    }
  };
  
  const colorValue = getColorValue();

  // Get the correct line number to display
  const getDisplayLineNumber = () => {
    if (isEditing && editingIndex !== null) {
      return editingIndex + 1;
    }
    return lineCount;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-xl pt-24 px-3 pb-6">
        <GameHeader 
          logoSrc={logoSrc} 
          gameName={gameName} 
          jackpotAmount={jackpotAmount} 
          colorValue={colorValue} 
        />

        <Card className="border-0 shadow-md overflow-hidden mb-4">
          <CurrentLineSelection
            lineCount={getDisplayLineNumber()}
            currentLine={currentLine}
            activeDigitIndex={activeDigitIndex}
            setActiveDigitIndex={setActiveDigitIndex}
            playTypes={playTypes}
            betAmounts={betAmounts}
            onQuickPick={handleQuickPick}
            onPlayTypeChange={handlePlayTypeChange}
            onBetAmountChange={handleBetAmountChange}
            onDigitSelect={handleDigitSelect}
            isLineComplete={isLineComplete}
            onClearSelections={clearSelections}
            onAddLine={handleAddLine}
            isEditing={isEditing}
            editingIndex={editingIndex}
            colorValue={colorValue}
          />

          <SavedLinesSection
            savedLines={savedLines}
            onRemoveLine={handleRemoveLine}
            onEditLine={handleEditLine}
            extraPlayName={extraPlayName}
            onToggleExtraPlay={handleToggleExtraPlay}
            onChangeDrawCount={handleChangeDrawCount}
            editingIndex={editingIndex}
            onStartNewLine={handleAddLine}
          />
        </Card>

        <TotalSummary 
          ticketPrice={getTicketPrice()}
          colorValue={colorValue}
          hasLines={savedLines.length > 0}
        />
      </div>
    </div>
  );
};
