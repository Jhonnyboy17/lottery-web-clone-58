import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HelpCircle, Trash2 } from "lucide-react";

interface Cash5PageProps {
  logoSrc: string;
  jackpotAmount: string;
  basePrice: number;
  primaryColor: string;
  gameName: string;
  extraPlayName?: string;
}

interface NumberSelection {
  digits: (number | null)[];
  playType: string;
  betAmount: string;
}

const Cash5Page = ({
  logoSrc,
  jackpotAmount,
  basePrice,
  primaryColor,
  gameName,
  extraPlayName = "FIREBALL™",
}: Cash5PageProps) => {
  const [currentLine, setCurrentLine] = useState<NumberSelection>({
    digits: [null, null, null, null],
    playType: "Straight",
    betAmount: "$1.00"
  });
  
  const [savedLines, setSavedLines] = useState<NumberSelection[]>([]);
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
    const calculateLinePrice = (line: NumberSelection) => {
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

  const getDigitDisplay = (index: number) => {
    const digit = currentLine.digits[index];
    
    if (digit !== null) {
      return digit.toString();
    }
    
    return "?";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md pt-4 px-3">
        <div className="flex items-center justify-between mb-4">
          <img 
            src={logoSrc} 
            alt={gameName} 
            className="h-12 w-auto"
          />
          <div className="text-right">
            <p className="text-sm font-semibold">JACKPOT</p>
            <h2 className="text-2xl font-bold" style={{ color: colorValue }}>R$ {jackpotAmount}</h2>
          </div>
        </div>

        <Card className="border-0 shadow-md overflow-hidden mb-4">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Line {String(lineCount).padStart(2, '0')}</h3>
              <Button 
                onClick={handleQuickPick}
                className="text-xs h-8 bg-white border hover:bg-opacity-10 rounded-full"
                style={{ color: "#0EA5E9", borderColor: "#0EA5E9" }}
              >
                QUICK PICK
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Play</span>
                <Select value={currentLine.playType} onValueChange={handlePlayTypeChange}>
                  <SelectTrigger className="w-32 border-b border-t-0 border-l-0 border-r-0 rounded-none h-8 focus:ring-0">
                    <SelectValue placeholder="Select play type" />
                  </SelectTrigger>
                  <SelectContent>
                    {playTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">for</span>
                <Select value={currentLine.betAmount} onValueChange={handleBetAmountChange}>
                  <SelectTrigger className="w-24 border-b border-t-0 border-l-0 border-r-0 rounded-none h-8 focus:ring-0">
                    <SelectValue placeholder="Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    {betAmounts.map((amount) => (
                      <SelectItem key={amount} value={amount}>{amount}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative mb-6 mt-8">
              <div className="flex justify-center items-center h-48 relative">
                <div className="absolute" style={{ top: '0%', left: '50%', transform: 'translateX(-50%)' }}>
                  <button
                    onClick={() => handleDigitSelect(0)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    0
                  </button>
                </div>
                <div className="absolute" style={{ top: '12%', right: '25%' }}>
                  <button
                    onClick={() => handleDigitSelect(1)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    1
                  </button>
                </div>
                <div className="absolute" style={{ top: '35%', right: '10%' }}>
                  <button
                    onClick={() => handleDigitSelect(2)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    2
                  </button>
                </div>
                <div className="absolute" style={{ top: '65%', right: '10%' }}>
                  <button
                    onClick={() => handleDigitSelect(3)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    3
                  </button>
                </div>
                <div className="absolute" style={{ top: '88%', right: '25%' }}>
                  <button
                    onClick={() => handleDigitSelect(4)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    4
                  </button>
                </div>
                <div className="absolute" style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                  <button
                    onClick={() => handleDigitSelect(5)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    5
                  </button>
                </div>
                <div className="absolute" style={{ top: '88%', left: '25%' }}>
                  <button
                    onClick={() => handleDigitSelect(6)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    6
                  </button>
                </div>
                <div className="absolute" style={{ top: '65%', left: '10%' }}>
                  <button
                    onClick={() => handleDigitSelect(7)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    7
                  </button>
                </div>
                <div className="absolute" style={{ top: '35%', left: '10%' }}>
                  <button
                    onClick={() => handleDigitSelect(8)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    8
                  </button>
                </div>
                <div className="absolute" style={{ top: '12%', left: '25%' }}>
                  <button
                    onClick={() => handleDigitSelect(9)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-medium hover:bg-blue-200"
                  >
                    9
                  </button>
                </div>
                
                <div className="text-center">
                  {activeDigitIndex !== null ? (
                    <div className="text-3xl font-bold">?</div>
                  ) : isLineComplete() ? (
                    <div className="text-3xl font-bold">✓</div>
                  ) : (
                    <>
                      <div className="text-sm font-medium">Select your first</div>
                      <div className="text-sm font-medium">number</div>
                      <div className="text-sm font-medium text-amber-500">to get started!</div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={clearSelections}
                  variant="link" 
                  className="text-xs text-gray-500"
                >
                  Clear selections
                </Button>
              </div>
            </div>

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
            
            {savedLines.length === 0 ? (
              <p className="text-sm text-gray-500 mb-3">No lines added yet</p>
            ) : (
              savedLines.map((line, index) => (
                <div key={index} className="bg-blue-50 rounded p-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-medium w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex">
                      {line.digits.map((digit, i) => (
                        <span 
                          key={i} 
                          className="text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-0.5 bg-blue-500"
                        >
                          {digit}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>{line.playType}</div>
                      <div>{line.betAmount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{line.betAmount}</span>
                    <button 
                      onClick={() => handleRemoveLine(index)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="mt-6 border border-amber-300 rounded-md bg-white p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">plus</span>
                  <span className="font-bold text-orange-500">FIREBALL™</span>
                  <span role="img" aria-label="fire">🔥</span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Add plus FIREBALL™ for more ways to win!</p>
                <p className="text-xs text-gray-600">
                  If you want to plus up your wager, try plus FIREBALL™! The FIREBALL number gives players another chance to win on their same numbers.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Checkbox 
                  id="fireball" 
                  checked={includeFireball}
                  onCheckedChange={(checked) => setIncludeFireball(checked as boolean)} 
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
          <div>
            <p className="text-sm font-medium">Total</p>
            <p className="text-xl font-bold">R$ {getTicketPrice()}</p>
          </div>
          <Button 
            className="hover:bg-opacity-90"
            style={{ backgroundColor: colorValue }}
            disabled={savedLines.length === 0}
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cash5Page;
