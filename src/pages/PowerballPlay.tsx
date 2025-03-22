
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, RefreshCcw, Clock, Heart } from "lucide-react";

const PowerballPlay = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPowerball, setSelectedPowerball] = useState<number | null>(null);
  const [includePowerPlay, setIncludePowerPlay] = useState(false);
  const [numberOfDraws, setNumberOfDraws] = useState("1");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentLine, setCurrentLine] = useState(1);
  const [savedLines, setSavedLines] = useState<{lineNumber: number, numbers: number[], powerball: number | null}[]>([]);

  const maxRegularNumbers = 5;
  const maxPowerballNumber = 1;

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

  const handleClearSelections = () => {
    setSelectedNumbers([]);
    setSelectedPowerball(null);
  };

  const handleAddLine = () => {
    if (selectedNumbers.length === maxRegularNumbers && selectedPowerball !== null) {
      setSavedLines([...savedLines, {
        lineNumber: currentLine,
        numbers: [...selectedNumbers],
        powerball: selectedPowerball
      }]);
      
      // Clear selections for next line
      setSelectedNumbers([]);
      setSelectedPowerball(null);
      setCurrentLine(currentLine + 1);
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
    <div className="min-h-screen bg-red-500">
      <div className="max-w-screen-xl mx-auto pt-8 px-4">
        {/* Powerball logo and jackpot section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1"></div>
          <div className="flex-2 flex justify-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/40f615be-7eee-405f-87cf-7df290c5da34.png" 
                alt="Powerball" 
                className="h-20 w-auto"
              />
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="bg-black text-white px-3 py-1 inline-block rounded mb-1">
              <p className="text-xs font-bold">JACKPOT IS CURRENTLY</p>
            </div>
            <h2 className="text-4xl font-bold text-black">$444,000,000</h2>
            <div className="bg-black text-white px-2 py-1 inline-block rounded mt-1">
              <p className="text-xs">DRAW CLOSE: MAR 23, 9:59 PM</p>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex justify-center space-x-4 mb-4 text-black">
          <Button variant="link" className="text-black font-semibold text-lg">Play Powerball®</Button>
          <Button variant="link" className="text-black font-semibold text-lg">Results</Button>
          <Button variant="link" className="text-black font-semibold text-lg">Number Checker</Button>
          <Button variant="link" className="text-black font-semibold text-lg">How to Play</Button>
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Line {currentLine}</h3>
              <Button 
                onClick={handleQuickPick}
                className="bg-white text-red-500 border border-red-500 hover:bg-red-50 rounded-full"
              >
                QUICK PICK
              </Button>
            </div>

            {/* Regular numbers selection */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <p className="font-medium">Numbers</p>
                <p className="text-sm text-gray-500">{selectedNumbers.length} of 5</p>
              </div>
              <div className="grid grid-cols-9 gap-2">
                {regularNumbers.map((number) => (
                  <button
                    key={`regular-${number}`}
                    onClick={() => handleNumberSelect(number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${selectedNumbers.includes(number) 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-100 text-black hover:bg-gray-200"}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Powerball selection */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <p className="font-medium">Powerball</p>
                <p className="text-sm text-gray-500">{selectedPowerball ? "1" : "0"} of 1</p>
              </div>
              <div className="grid grid-cols-9 gap-2">
                {powerballNumbers.map((number) => (
                  <button
                    key={`powerball-${number}`}
                    onClick={() => handlePowerballSelect(number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${selectedPowerball === number 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-100 text-black hover:bg-gray-200"}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost and Clear selection */}
            <div className="flex justify-between items-center mt-4 pb-4">
              <div className="text-sm font-medium">
                Line cost: $2.00
              </div>
              <Button 
                variant="ghost" 
                onClick={handleClearSelections}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear selections
              </Button>
            </div>
          </div>

          {/* Saved lines / My Lines */}
          <div className="bg-gray-50 p-6">
            <h3 className="text-xl font-bold mb-4">My Lines</h3>
            
            {savedLines.map((line, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4 mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {line.lineNumber}
                  </span>
                  {line.numbers.map((num, i) => (
                    <span key={i} className="bg-white rounded-full w-8 h-8 flex items-center justify-center mx-1">
                      {num}
                    </span>
                  ))}
                  <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center ml-1">
                    {line.powerball}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveLine(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}

            {/* PowerPlay option */}
            <Card className="border border-red-500 mt-8 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-2">Add Power Play® to your ticket!</h4>
                  <p className="text-sm text-gray-600">
                    For an additional $1.00 per line, you can multiply your non-jackpot winnings.
                  </p>
                </div>
                <Checkbox 
                  id="powerplay" 
                  checked={includePowerPlay}
                  onCheckedChange={(checked) => setIncludePowerPlay(checked as boolean)} 
                  className="h-5 w-5"
                />
              </div>
            </Card>

            {/* Number of draws */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">For how many draws?</h4>
              <Select value={numberOfDraws} onValueChange={setNumberOfDraws}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of draws" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 draw</SelectItem>
                  <SelectItem value="2">2 draws</SelectItem>
                  <SelectItem value="3">3 draws</SelectItem>
                  <SelectItem value="4">4 draws</SelectItem>
                  <SelectItem value="5">5 draws</SelectItem>
                  <SelectItem value="10">10 draws</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subscribe option */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Subscribe</h4>
                  <p className="text-sm text-gray-600">
                    Automatically purchase tickets for each draw. Cancel whenever you like.
                  </p>
                </div>
                <Switch
                  checked={isSubscribed}
                  onCheckedChange={setIsSubscribed}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-4 flex justify-between items-center bg-white p-4 rounded-lg">
          <p className="text-gray-700">Please select 5 Numbers & 1 Powerball!</p>
          <div className="flex items-center space-x-4">
            <p className="font-bold text-xl">${getTicketPrice()}</p>
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              disabled={savedLines.length === 0}
            >
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerballPlay;
