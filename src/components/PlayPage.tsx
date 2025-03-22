
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface PlayPageProps {
  logoSrc: string;
  jackpotAmount: string;
  basePrice: number;
  primaryColor: string;
  gameName: string;
  extraPlayName?: string;
  extraPlayPrice?: number;
  maxRegularNumbers?: number;
  totalRegularNumbers?: number;
  maxPowerballNumbers?: number;
  totalPowerballNumbers?: number;
}

const PlayPage = ({
  logoSrc,
  jackpotAmount,
  basePrice,
  primaryColor,
  gameName,
  extraPlayName = "Power Play®",
  extraPlayPrice = 1.00,
  maxRegularNumbers = 5,
  totalRegularNumbers = 69,
  maxPowerballNumbers = 1,
  totalPowerballNumbers = 26,
}: PlayPageProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPowerball, setSelectedPowerball] = useState<number | null>(null);
  const [includeExtraPlay, setIncludeExtraPlay] = useState(false);
  const [numberOfDraws, setNumberOfDraws] = useState("1");
  const [savedLines, setSavedLines] = useState<{numbers: number[], powerball: number | null}[]>([]);

  const regularNumbers = Array.from({ length: totalRegularNumbers }, (_, i) => i + 1);
  const powerballNumbers = Array.from({ length: totalPowerballNumbers }, (_, i) => i + 1);
  const hasPowerball = maxPowerballNumbers > 0;

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
      const randomNumber = Math.floor(Math.random() * totalRegularNumbers) + 1;
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    
    let randomPowerball = null;
    if (hasPowerball) {
      randomPowerball = Math.floor(Math.random() * totalPowerballNumbers) + 1;
    }
    
    setSelectedNumbers(newNumbers);
    setSelectedPowerball(randomPowerball);
  };

  const handleAddLine = () => {
    if (selectedNumbers.length === maxRegularNumbers && (!hasPowerball || selectedPowerball !== null)) {
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

  const getColorValue = () => {
    switch (primaryColor) {
      case "blue-600":
        return "#2563eb";
      case "red-600":
        return "#dc2626";
      case "green-600":
        return "#16a34a";
      case "cyan-600":
        return "#0891b2";
      case "amber-500":
        return "#f59e0b";
      default:
        return "#000000";
    }
  };

  const colorValue = getColorValue();

  const regularNumbersProgress = (selectedNumbers.length / maxRegularNumbers) * 100;
  
  const powerballProgress = selectedPowerball ? 100 : 0;

  const isLineComplete = () => {
    if (hasPowerball) {
      return selectedNumbers.length === maxRegularNumbers && selectedPowerball !== null;
    } else {
      return selectedNumbers.length === maxRegularNumbers;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl pt-4 px-3">
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
              {/* Removed "Select Numbers" text */}
              <Button 
                onClick={handleQuickPick}
                className="text-xs h-8 bg-white border hover:bg-opacity-10 px-6"
                style={{ color: colorValue, borderColor: colorValue }}
              >
                JOGADA ALEATÓRIA
              </Button>
            </div>

            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Escolha {maxRegularNumbers} Números</p>
              <span className="text-xs font-medium">{selectedNumbers.length} de {maxRegularNumbers}</span>
            </div>
            <div className="mb-3">
              <Progress 
                value={regularNumbersProgress} 
                className="h-2"
                style={{ 
                  backgroundColor: "#e5e7eb", 
                }}
              >
                <div 
                  className="h-full transition-all" 
                  style={{ 
                    width: `${regularNumbersProgress}%`,
                    backgroundColor: colorValue
                  }}
                />
              </Progress>
            </div>
            <div className="grid grid-cols-9 gap-1 mb-4">
              {regularNumbers.map((number) => (
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

            {hasPowerball && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Escolha {maxPowerballNumbers} Powerball</p>
                  <span className="text-xs font-medium">{selectedPowerball ? 1 : 0} de {maxPowerballNumbers}</span>
                </div>
                <div className="mb-3">
                  <Progress 
                    value={powerballProgress} 
                    className="h-2"
                    style={{ 
                      backgroundColor: "#e5e7eb", 
                    }}
                  >
                    <div 
                      className="h-full transition-all" 
                      style={{ 
                        width: `${powerballProgress}%`,
                        backgroundColor: "#f59e0b" 
                      }}
                    />
                  </Progress>
                </div>
                <div className="grid grid-cols-9 gap-1 mb-4">
                  {powerballNumbers.map((number) => (
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
              </>
            )}

            <Button 
              onClick={handleAddLine} 
              disabled={!isLineComplete()}
              className="w-full hover:bg-opacity-90 mt-2 px-10"
              style={{ backgroundColor: colorValue }}
            >
              ADD LINHA
            </Button>
          </div>

          <div className="bg-gray-50 p-4">
            <h3 className="font-semibold mb-3">Minhas Linhas</h3>
            
            {savedLines.length === 0 ? (
              <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p>
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
                    {hasPowerball && line.powerball && (
                      <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ml-1">
                        {line.powerball}
                      </span>
                    )}
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
                  Adicionar {extraPlayName} (+R${extraPlayPrice.toFixed(2)} por linha)
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium block mb-1">Número de Sorteios</label>
              <Select value={numberOfDraws} onValueChange={setNumberOfDraws}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Selecionar número de sorteios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 sorteio</SelectItem>
                  <SelectItem value="2">2 sorteios</SelectItem>
                  <SelectItem value="3">3 sorteios</SelectItem>
                  <SelectItem value="4">4 sorteios</SelectItem>
                  <SelectItem value="5">5 sorteios</SelectItem>
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
            className="hover:bg-opacity-90 px-6"
            style={{ backgroundColor: colorValue }}
            disabled={savedLines.length === 0}
          >
            ADICIONAR AO CARRINHO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
