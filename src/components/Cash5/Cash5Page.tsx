
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import GameHeader from "./GameHeader";
import NumberSelection from "./NumberSelection";
import TicketOptions from "./TicketOptions";
import SavedLines from "./SavedLines";
import FireballOption from "./FireballOption";
import TotalSummary from "./TotalSummary";
import { NumberSelectionType } from "./types";

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
  const [currentLine, setCurrentLine] = useState<NumberSelectionType>({
    digits: [null, null, null, null],
    playType: "Straight",
    betAmount: "$1.00"
  });
  
  const [savedLines, setSavedLines] = useState<NumberSelectionType[]>([]);
  const [lineCount, setLineCount] = useState(1);
  const [includeFireball, setIncludeFireball] = useState(false);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(null);

  const playTypes = ["Back Pair", "Box", "Combo", "Front Pair", "Straight", "Straight/Box"];
  const betAmounts = ["$0.50", "$1.00", "$2.00", "$3.00", "$4.00", "$5.00"];

  const getColorValue = () => {
    switch (primaryColor) {
      case "amber-500":
        return "#f59e0b"; // Amber for Cash 5
      default:
        return "#f59e0b"; // Default to amber
    }
  };
  
  const colorValue = getColorValue();

  const handleDigitSelect = (digit: number) => {
    if (activeDigitIndex === null) return;
    
    const newDigits = [...currentLine.digits];
    newDigits[activeDigitIndex] = digit;
    
    setCurrentLine({
      ...currentLine,
      digits: newDigits
    });
    
    const nextEmptyIndex = newDigits.findIndex((d, i) => d === null && i > activeDigitIndex);
    if (nextEmptyIndex !== -1) {
      setActiveDigitIndex(nextEmptyIndex);
    } else {
      setActiveDigitIndex(null);
    }
  };

  const handlePlayTypeChange = (value: string) => {
    setCurrentLine({
      ...currentLine,
      playType: value
    });
  };

  const handleBetAmountChange = (value: string) => {
    setCurrentLine({
      ...currentLine,
      betAmount: value
    });
  };

  const handleQuickPick = () => {
    const randomDigits = Array(4).fill(0).map(() => 
      Math.floor(Math.random() * 10)
    );
    
    setCurrentLine({
      ...currentLine,
      digits: randomDigits
    });
    
    setActiveDigitIndex(null);
  };

  const clearSelections = () => {
    setCurrentLine({
      ...currentLine,
      digits: [null, null, null, null]
    });
    setActiveDigitIndex(null);
  };

  const handleAddLine = () => {
    if (currentLine.digits.some(digit => digit === null)) return;
    
    setSavedLines([...savedLines, {...currentLine}]);
    setLineCount(lineCount + 1);
    
    setCurrentLine({
      digits: [null, null, null, null],
      playType: currentLine.playType,
      betAmount: currentLine.betAmount
    });
    
    setActiveDigitIndex(null);
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
  };

  const getTicketPrice = () => {
    const calculateLinePrice = (line: NumberSelectionType) => {
      const amount = parseFloat(line.betAmount.replace('$', ''));
      return amount;
    };

    const totalBasePrice = savedLines.reduce((sum, line) => sum + calculateLinePrice(line), 0);
    const fireballPrice = includeFireball ? savedLines.length * 1 : 0;
    
    return (totalBasePrice + fireballPrice).toFixed(2);
  };

  const isLineComplete = () => {
    return !currentLine.digits.some(digit => digit === null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md pt-4 px-3">
        <GameHeader logoSrc={logoSrc} gameName={gameName} jackpotAmount={jackpotAmount} colorValue={colorValue} />

        <Card className="border-0 shadow-md overflow-hidden mb-4">
          <div className="p-4">
            <TicketOptions 
              lineCount={lineCount} 
              currentLine={currentLine}
              playTypes={playTypes}
              betAmounts={betAmounts}
              onQuickPick={handleQuickPick}
              onPlayTypeChange={handlePlayTypeChange}
              onBetAmountChange={handleBetAmountChange}
            />

            <NumberSelection 
              activeDigitIndex={activeDigitIndex}
              setActiveDigitIndex={setActiveDigitIndex}
              currentLine={currentLine}
              onDigitSelect={handleDigitSelect}
              isLineComplete={isLineComplete}
              onClearSelections={clearSelections}
            />

            <Button 
              onClick={handleAddLine} 
              disabled={!isLineComplete()}
              className="w-full hover:bg-opacity-90 mt-2"
              style={{ backgroundColor: colorValue }}
            >
              ADD LINE
            </Button>
          </div>

          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold mb-3">My Lines</h3>
            
            <SavedLines 
              savedLines={savedLines} 
              onRemoveLine={handleRemoveLine} 
            />

            <FireballOption 
              extraPlayName={extraPlayName}
              includeFireball={includeFireball}
              setIncludeFireball={setIncludeFireball}
            />
          </div>
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
