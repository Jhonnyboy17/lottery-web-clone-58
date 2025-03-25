
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import GameHeader from "./GameHeader";
import CurrentLineSelection from "./CurrentLineSelection";
import SavedLinesSection from "./SavedLinesSection";
import TotalSummary from "./TotalSummary";
import { useTicketState } from "./hooks/useTicketState";
import Navbar from "@/components/Navbar";

interface Cash5PageProps {
  logoSrc: string;
  jackpotAmount: string;
  basePrice: number;
  primaryColor: string;
  gameName: string;
  extraPlayName?: string;
}

export const Cash5Page = ({
  logoSrc,
  jackpotAmount,
  basePrice,
  primaryColor,
  gameName,
  extraPlayName = "FIREBALL™",
}: Cash5PageProps) => {
  const playTypes = ["Box", "Combo", "Straight", "Straight/Box"];
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
    setIsEditing,
    setEditingIndex
  } = useTicketState();

  const getColorValue = () => {
    switch (primaryColor) {
      case "amber-500":
        return "#f59e0b"; // Amber for Cash 5
      default:
        return "#f59e0b"; // Default to amber
    }
  };
  
  const colorValue = getColorValue();

  // Force a re-render when the component mounts to ensure the template line is visible
  useEffect(() => {
    // This empty effect ensures that the component re-renders after mount
  }, []);

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
            lineCount={lineCount}
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
            onEditLine={(index) => {
              // When editing a line, make sure the new line template doesn't show selected numbers
              handleEditLine(index);
            }}
            extraPlayName={extraPlayName}
            editingIndex={editingIndex}
            currentLine={isEditing ? currentLine : null} // Only pass currentLine when actually editing
            onStartNewLine={() => {
              if (isEditing) {
                setIsEditing(false);
                setEditingIndex(null);
                clearSelections();
              } else {
                // Ensure we're not editing when starting a new line
                setIsEditing(false);
                setEditingIndex(null);
                clearSelections();
              }
            }}
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
