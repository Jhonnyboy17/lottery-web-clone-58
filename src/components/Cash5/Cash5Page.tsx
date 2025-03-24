
import React from "react";
import { Card } from "@/components/ui/card";
import GameHeader from "./GameHeader";
import CurrentLineSelection from "./CurrentLineSelection";
import SavedLinesSection from "./SavedLinesSection";
import TotalSummary from "./TotalSummary";
import { useTicketState } from "./hooks/useTicketState";
import Navbar from "@/components/Navbar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <Navbar />
      <div className="mx-auto max-w-7xl pt-24 px-3 pb-24">
        <GameHeader 
          logoSrc={logoSrc} 
          gameName={gameName} 
          jackpotAmount={jackpotAmount} 
          colorValue={colorValue} 
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Number selection */}
          <div className="w-full md:w-3/5">
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
            </Card>
          </div>

          {/* Right column - Saved lines */}
          <div className="w-full md:w-2/5">
            <Card className="border-0 shadow-md overflow-hidden mb-4">
              <div className="p-4">
                <h3 className="font-semibold mb-3">Minhas Linhas</h3>
                <SavedLinesSection
                  savedLines={savedLines}
                  onRemoveLine={handleRemoveLine}
                  onEditLine={handleEditLine}
                  extraPlayName={extraPlayName}
                />
              </div>
            </Card>

            {/* Fireball option */}
            <Card className="border-0 shadow-md overflow-hidden mb-4 p-4">
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-lg">{extraPlayName}</div>
                  <Checkbox 
                    id="fireball-all"
                    checked={savedLines.every(line => line.includeExtraPlay)}
                    onCheckedChange={(checked) => {
                      // Implementar funcionalidade para marcar/desmarcar todas
                    }}
                    disabled={savedLines.length === 0}
                  />
                </div>
                <p className="text-sm mb-1">Add {extraPlayName} to your ticket!</p>
                <p className="text-xs">
                  For an additional fee per line, you can increase your chances of winning.
                </p>
              </div>
            </Card>

            {/* Draw count selection */}
            <Card className="border-0 shadow-md overflow-hidden mb-4">
              <div className="p-4">
                <h3 className="font-semibold mb-2">For how many draws?</h3>
                <Select value="1">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar número de sorteios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 draw</SelectItem>
                    <SelectItem value="2">2 draws</SelectItem>
                    <SelectItem value="3">3 draws</SelectItem>
                    <SelectItem value="4">4 draws</SelectItem>
                    <SelectItem value="5">5 draws</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-4 bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Subscribe</h4>
                    <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                  </div>
                  <p className="text-xs mt-1">
                    Automatically purchase tickets for each draw. Cancel whenever you like.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <TotalSummary 
        ticketPrice={getTicketPrice()}
        colorValue={colorValue}
        hasLines={savedLines.length > 0}
      />
    </div>
  );
};
