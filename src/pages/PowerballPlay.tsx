
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PowerballPlay = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPowerball, setSelectedPowerball] = useState<number | null>(null);
  const [includePowerPlay, setIncludePowerPlay] = useState(false);
  const [numberOfDraws, setNumberOfDraws] = useState("1");
  const [savedLines, setSavedLines] = useState<{numbers: number[], powerball: number | null}[]>([]);

  const maxRegularNumbers = 5;

  // Generate numbers 1-69 for regular selection
  const regularNumbers = Array.from({ length: 69 }, (_, i) => i + 1);
  // Generate numbers 1-26 for Powerball selection
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
    // Generate 5 unique random numbers between 1-69
    const newNumbers: number[] = [];
    while (newNumbers.length < maxRegularNumbers) {
      const randomNumber = Math.floor(Math.random() * 69) + 1;
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    
    // Generate 1 random Powerball number between 1-26
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
    let basePrice = savedLines.length * 2.00; // $2 per line
    if (includePowerPlay) {
      basePrice += savedLines.length * 1.00; // $1 extra for PowerPlay
    }
    basePrice = basePrice * parseInt(numberOfDraws); // Multiply by number of draws
    return basePrice.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md pt-4 px-3">
        {/* Header with logo and jackpot */}
        <div className="flex items-center justify-between mb-4">
          <img 
            src="/lovable-uploads/40f615be-7eee-405f-87cf-7df290c5da34.png" 
            alt="Powerball" 
            className="h-12 w-auto"
          />
          <div className="text-right">
            <p className="text-sm font-semibold">JACKPOT</p>
            <h2 className="text-2xl font-bold text-red-600">R$ 444.000.000</h2>
          </div>
        </div>

        {/* Main content area */}
        <Card className="border-0 shadow-md overflow-hidden mb-4">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Select Numbers</h3>
              <Button 
                onClick={handleQuickPick}
                className="text-xs h-8 bg-white text-red-600 border border-red-600 hover:bg-red-50"
              >
                QUICK PICK
              </Button>
            </div>

            {/* Regular numbers selection */}
            <p className="text-sm font-medium mb-2">Choose 5 Numbers</p>
            <div className="grid grid-cols-8 gap-1 mb-4">
              {regularNumbers.slice(0, 40).map((number) => (
                <button
                  key={`regular-${number}`}
                  onClick={() => handleNumberSelect(number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${selectedNumbers.includes(number) 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-100 text-black hover:bg-gray-200"}`}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Powerball selection */}
            <p className="text-sm font-medium mb-2">Choose 1 Powerball</p>
            <div className="grid grid-cols-8 gap-1 mb-4">
              {powerballNumbers.slice(0, 16).map((number) => (
                <button
                  key={`powerball-${number}`}
                  onClick={() => handlePowerballSelect(number)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${selectedPowerball === number 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-100 text-black hover:bg-gray-200"}`}
                >
                  {number}
                </button>
              ))}
            </div>

            <Button 
              onClick={handleAddLine} 
              disabled={!(selectedNumbers.length === 5 && selectedPowerball !== null)}
              className="w-full bg-red-600 hover:bg-red-700 mt-2"
            >
              ADD LINE
            </Button>
          </div>

          {/* Selected lines */}
          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold mb-3">My Lines</h3>
            
            {savedLines.length === 0 ? (
              <p className="text-sm text-gray-500 mb-3">No lines added yet</p>
            ) : (
              savedLines.map((line, index) => (
                <div key={index} className="bg-white rounded p-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {line.numbers.map((num, i) => (
                      <span key={i} className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs mx-0.5">
                        {num}
                      </span>
                    ))}
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ml-1">
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

            {/* PowerPlay option */}
            <div className="flex items-center justify-between mt-4 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="powerplay" 
                  checked={includePowerPlay}
                  onCheckedChange={(checked) => setIncludePowerPlay(checked as boolean)} 
                />
                <label htmlFor="powerplay" className="text-sm font-medium">
                  Add Power Play® (+$1.00 per line)
                </label>
              </div>
            </div>

            {/* Number of draws */}
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

        {/* Bottom total and add to cart */}
        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
          <div>
            <p className="text-sm font-medium">Total</p>
            <p className="text-xl font-bold">R$ {getTicketPrice()}</p>
          </div>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            disabled={savedLines.length === 0}
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PowerballPlay;
