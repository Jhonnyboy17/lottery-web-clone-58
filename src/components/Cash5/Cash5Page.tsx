import React from "react";
import { Card } from "@/components/ui/card";
import GameHeader from "./GameHeader";
import CurrentLineSelection from "./CurrentLineSelection";
import SavedLinesSection from "./SavedLinesSection";
import TotalSummary from "./TotalSummary";
import { useTicketState } from "./hooks/useTicketState";

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
  const betAmounts = ["$0.50", "$1.00", "$2.00", "$3.00", "$4.00", "$5.00"];
  
  const {
    currentLine,
    savedLines,
    lineCount,
    includeFireball,
    activeDigitIndex,
    setActiveDigitIndex,
    handleDigitSelect,
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections,
    handleAddLine,
    handleRemoveLine,
    setIncludeFireball,
    isLineComplete,
    getTicketPrice
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

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md pt-4 px-3">
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
