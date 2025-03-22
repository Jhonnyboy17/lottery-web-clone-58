
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlayPageProps {
  logoSrc: string;
  jackpotAmount: string;
  basePrice: number;
  primaryColor: string;
  gameName: string;
  extraPlayName?: string;
  extraPlayPrice?: number;
}

const PlayPage = ({
  logoSrc,
  jackpotAmount,
  basePrice,
  primaryColor,
  gameName,
  extraPlayName = "Power Play®",
  extraPlayPrice = 1.00,
}: PlayPageProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPowerball, setSelectedPowerball] = useState<number | null>(null);
  const [includeExtraPlay, setIncludeExtraPlay] = useState(false);
  const [numberOfDraws, setNumberOfDraws] = useState("1");
  const [savedLines, setSavedLines] = useState<{numbers: number[], powerball: number | null}[]>([]);

  const maxRegularNumbers = 5;

  const regularNumbers = Array.from({ length: 69 }, (_, i) => i + 1);
  const powerballNumbers = Array.from({ length: 26 }, (_, i) => i + 1);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < maxRegularNumbers) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handlePowerballSelect = (number: number) => {
    if (selectedPowerball === number) {
      setSelectedPowerball(null);
    } else {
      setSelectedPowerball(number);
    }
  };

  const handleQuickPick = () => {
    const newNumbers: number[] = [];
    while (newNumbers.length < maxRegularNumbers) {
      const randomNumber = Math.floor(Math.random() * 69) + 1;
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    
    const randomPowerball = Math.floor(Math.random() * 26) + 1;
    
    setSelectedNumbers(newNumbers);
    setSelectedPowerball(randomPowerball);
  };

  const handleAddLine = () => {
    if (selectedNumbers.length === maxRegularNumbers && selectedPowerball !== null) {
      setSavedLines([...savedLines, {
        numbers: [...selectedNumbers],
        powerball: selectedPowerball
      }]);
      
      setSelectedNumbers([]);
      setSelectedPowerball(null);
    }
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
  };

  const getTicketPrice = () => {
    let price = savedLines.length * basePrice;
    if (includeExtraPlay) {
      price += savedLines.length * extraPlayPrice;
    }
    price = price * parseInt(numberOfDraws);
    return price.toFixed(2);
  };

  // Convert primaryColor to actual CSS color value
  const getColorValue = () => {
    switch (primaryColor) {
      case "blue-600":
        return "#2563eb"; // Dark blue for Mega Millions
      case "red-600":
        return "#dc2626"; // Red for Powerball
      case "green-600":
        return "#16a34a"; // Green for Lucky Day
      case "cyan-600":
        return "#0891b2"; // Cyan for Pick 4
      case "amber-500":
        return "#f59e0b"; // Amber for Cash 5 and Fast Play
      default:
        return "#000000"; // Default to black
    }
  };

  const colorValue = getColorValue();

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
              <h3 className="text-lg font-semibold">Select Numbers</h3>
              <Button 
                onClick={handleQuickPick}
                className="text-xs h-8 bg-white border hover:bg-opacity-10"
                style={{ color: colorValue, borderColor: colorValue }}
              >
                QUICK PICK
              </Button>
            </div>

            <p className="text-sm font-medium mb-2">Choose 5 Numbers</p>
            <div className="grid grid-cols-8 gap-1 mb-4">
              {regularNumbers.slice(0, 40).map((number) => (
                <button
                  key={`regular-${number}`}
                  onClick={() => handleNumberSelect(number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${selectedNumbers.includes(number) 
                      ? "text-white" 
                      : "bg-gray-100 text-black hover:bg-gray-200"}`}
                  style={selectedNumbers.includes(number) ? { backgroundColor: colorValue } : {}}
                >
                  {number}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium mb-2">Choose 1 Powerball</p>
            <div className="grid grid-cols-8 gap-1 mb-4">
              {powerballNumbers.slice(0, 16).map((number) => (
                <button
                  key={`powerball-${number}`}
                  onClick={() => handlePowerballSelect(number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${selectedPowerball === number 
                      ? "bg-amber-500 text-white" 
                      : "bg-gray-100 text-black hover:bg-gray-200"}`}
                >
                  {number}
                </button>
              ))}
            </div>

            <Button 
              onClick={handleAddLine} 
              disabled={!(selectedNumbers.length === 5 && selectedPowerball !== null)}
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
                <div key={index} className="bg-white rounded p-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {line.numbers.map((num, i) => (
                      <span 
                        key={i} 
                        className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mx-0.5"
                        style={{ backgroundColor: colorValue }}
                      >
                        {num}
                      </span>
                    ))}
                    <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ml-1">
                      {line.powerball}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemoveLine(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}

            <div className="flex items-center justify-between mt-4 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="extraplay" 
                  checked={includeExtraPlay}
                  onCheckedChange={(checked) => setIncludeExtraPlay(checked as boolean)} 
                />
                <label htmlFor="extraplay" className="text-sm font-medium">
                  Add {extraPlayName} (+R${extraPlayPrice.toFixed(2)} per line)
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium block mb-1">Number of Draws</label>
              <Select value={numberOfDraws} onValueChange={setNumberOfDraws}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select number of draws" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 draw</SelectItem>
                  <SelectItem value="2">2 draws</SelectItem>
                  <SelectItem value="3">3 draws</SelectItem>
                  <SelectItem value="4">4 draws</SelectItem>
                  <SelectItem value="5">5 draws</SelectItem>
                </SelectContent>
              </Select>
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

export default PlayPage;
