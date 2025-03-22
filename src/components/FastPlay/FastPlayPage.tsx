
import React from "react";
import { Card } from "@/components/ui/card";
import GameHeader from "../Cash5/GameHeader";
import CurrentLineSelection from "../Cash5/CurrentLineSelection";
import SavedLinesSection from "../Cash5/SavedLinesSection";
import TotalSummary from "../Cash5/TotalSummary";
import { useTicketState } from "./hooks/useTicketState"; // Updated import path

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
    includeFireball,
    activeDigitIndex,
    selectedDrawTime,
    selectedDrawCount,
    setActiveDigitIndex,
    handleDigitSelect,
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections,
    handleAddLine,
    handleRemoveLine,
    setIncludeFireball,
    setSelectedDrawTime,
    setSelectedDrawCount,
    isLineComplete,
    getTicketPrice
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

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl pt-4 px-3">
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
            isLineComplete={isLineComplete} // Pass the function, not its result
            onClearSelections={clearSelections}
            onAddLine={handleAddLine}
            colorValue={colorValue}
          />

          <SavedLinesSection
            savedLines={savedLines}
            onRemoveLine={handleRemoveLine}
            extraPlayName={extraPlayName}
            includeFireball={includeFireball}
            setIncludeFireball={setIncludeFireball}
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
