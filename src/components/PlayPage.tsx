import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SavedLineType } from "./Cash5/types";
import GameLayout from "./GameLayout";

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
  extraPlayPrice = 10.00,
  maxRegularNumbers = 5,
  totalRegularNumbers = 69,
  maxPowerballNumbers = 1,
  totalPowerballNumbers = 26
}: PlayPageProps) => {
  
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPowerball, setSelectedPowerball] = useState<number | null>(null);
  const [includeExtraPlay, setIncludeExtraPlay] = useState(false);
  const [numberOfDraws, setNumberOfDraws] = useState("1");
  const [savedLines, setSavedLines] = useState<SavedLineType[]>([]);
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isNumberClicked, setIsNumberClicked] = useState(false);
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const regularNumbers = Array.from({
    length: totalRegularNumbers
  }, (_, i) => i + 1);
  const powerballNumbers = Array.from({
    length: totalPowerballNumbers
  }, (_, i) => i + 1);
  const hasPowerball = maxPowerballNumbers > 0;

  const calculateRegularProgress = () => selectedNumbers.length / maxRegularNumbers * 100;
  const calculatePowerballProgress = () => selectedPowerball ? 100 : 0;

  const getLineCount = () => {
    if (editingLineIndex !== null) {
      return editingLineIndex + 1;
    }
    return savedLines.length + 1;
  };

  useEffect(() => {
    if (selectedNumbers.length === maxRegularNumbers && (!hasPowerball || selectedPowerball !== null) && !isNumberClicked && !editMode) {
      const timer = setTimeout(() => {
        handleAddLine();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedNumbers, selectedPowerball, isNumberClicked, editMode]);

  useEffect(() => {
    if (!isAnimating) {
      setProgressValue(calculateRegularProgress());
      return;
    }
    const targetProgress = calculateRegularProgress();
    if (progressValue < targetProgress) {
      const animationStep = 2;
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev < targetProgress) {
            const next = Math.min(prev + animationStep, targetProgress);
            return next;
          } else {
            clearInterval(interval);
            setIsAnimating(false);
            return targetProgress;
          }
        });
      }, 10);
      return () => clearInterval(interval);
    } else {
      setProgressValue(targetProgress);
      setIsAnimating(false);
    }
  }, [isAnimating, selectedNumbers.length, maxRegularNumbers]);

  useEffect(() => {
    if (cooldownTime > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setCooldownTime(prev => {
          const newValue = Math.max(0, prev - 1);
          if (newValue === 0) {
            clearInterval(cooldownTimerRef.current as NodeJS.Timeout);
            cooldownTimerRef.current = null;
          }
          return newValue;
        });
      }, 1000);
      return () => {
        if (cooldownTimerRef.current) {
          clearInterval(cooldownTimerRef.current);
          cooldownTimerRef.current = null;
        }
      };
    }
  }, [cooldownTime]);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  const handleNumberSelect = (number: number) => {
    setIsNumberClicked(true);
    setIsEditingNumber(true);
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < maxRegularNumbers) {
      const newNumbers = [...selectedNumbers, number];
      setSelectedNumbers(newNumbers);
    }
    
    setTimeout(() => {
      setIsNumberClicked(false);
      
      // Only reset editing state if line is not complete or if we're not in edit mode
      if (selectedNumbers.length < maxRegularNumbers - 1 || !editMode) {
        setTimeout(() => {
          setIsEditingNumber(false);
        }, 300);
      }
    }, 2000);
  };

  const handlePowerballSelect = (number: number) => {
    setIsNumberClicked(true);
    setIsEditingNumber(true);
    
    if (selectedPowerball === number) {
      setSelectedPowerball(null);
    } else {
      setSelectedPowerball(number);
    }
    
    setTimeout(() => {
      setIsNumberClicked(false);
      
      // Only reset editing state if we're not in edit mode
      if (!editMode) {
        setTimeout(() => {
          setIsEditingNumber(false);
        }, 300);
      }
    }, 2000);
  };

  const handleQuickPick = () => {
    if (isRandomizing) return;
    const selectedCount = selectedNumbers.length;
    let newCooldownTime = 4; // Default cooldown
    if (selectedCount >= 3) {
      newCooldownTime = 2;
    } else if (selectedCount >= 2) {
      newCooldownTime = 3;
    } else {
      newCooldownTime = 4;
    }
    setCooldownTime(newCooldownTime);
    setIsRandomizing(true);
    setIsAnimating(true);
    setIsEditingNumber(true);
    
    const currentSelectedCount = selectedNumbers.length;
    const numbersNeeded = maxRegularNumbers - currentSelectedCount;
    if (numbersNeeded > 0) {
      const availableNumbers = regularNumbers.filter(num => !selectedNumbers.includes(num));
      let newNumbers: number[] = [];
      for (let i = 0; i < numbersNeeded; i++) {
        if (availableNumbers.length) {
          const randomIndex = Math.floor(Math.random() * availableNumbers.length);
          newNumbers.push(availableNumbers[randomIndex]);
          availableNumbers.splice(randomIndex, 1);
        }
      }
      newNumbers.forEach((num, index) => {
        setTimeout(() => {
          setSelectedNumbers(prev => [...prev, num]);
          if (index === newNumbers.length - 1 && (!hasPowerball || selectedPowerball !== null)) {
            setTimeout(() => {
              setIsRandomizing(false);
              setTimeout(() => {
                if (!editMode) {
                  setIsEditingNumber(false);
                }
              }, 300);
            }, 300);
          }
        }, (index + 1) * 150);
      });
    }
    if (hasPowerball && selectedPowerball === null) {
      setTimeout(() => {
        const randomPowerball = Math.floor(Math.random() * totalPowerballNumbers) + 1;
        setSelectedPowerball(randomPowerball);
        setTimeout(() => {
          setIsRandomizing(false);
          setTimeout(() => {
            if (!editMode) {
              setIsEditingNumber(false);
            }
          }, 300);
        }, 300);
      }, (numbersNeeded + 1) * 150);
    } else if (numbersNeeded === 0) {
      setTimeout(() => {
        setIsRandomizing(false);
        setTimeout(() => {
          if (!editMode) {
            setIsEditingNumber(false);
          }
        }, 300);
      }, 300);
    }
    setEditingLineIndex(null);
  };

  const handleAddLine = () => {
    if (selectedNumbers.length === maxRegularNumbers && (!hasPowerball || selectedPowerball !== null)) {
      if (editingLineIndex !== null) {
        const updatedLines = [...savedLines];
        updatedLines[editingLineIndex] = {
          numbers: [...selectedNumbers],
          powerball: selectedPowerball,
          includeExtraPlay,
          drawCount: numberOfDraws
        };
        setSavedLines(updatedLines);
        setEditingLineIndex(null);
      } else {
        setSavedLines([...savedLines, {
          numbers: [...selectedNumbers],
          powerball: selectedPowerball,
          includeExtraPlay,
          drawCount: numberOfDraws
        }]);
      }
      setSelectedNumbers([]);
      setSelectedPowerball(null);
      setIncludeExtraPlay(false);
      setNumberOfDraws("1");
      setProgressValue(0);
      setIsAnimating(false);
      setEditMode(false);
      setIsEditingNumber(false);
    }
  };

  const handleRemoveLine = (lineIndex: number) => {
    setSavedLines(savedLines.filter((_, index) => index !== lineIndex));
    if (editingLineIndex === lineIndex) {
      setEditingLineIndex(null);
      setSelectedNumbers([]);
      setSelectedPowerball(null);
      setIncludeExtraPlay(false);
      setNumberOfDraws("1");
      setEditMode(false);
      setIsEditingNumber(false);
    }
  };

  const handleEditLine = (lineIndex: number) => {
    const lineToEdit = savedLines[lineIndex];
    setSelectedNumbers(lineToEdit.numbers);
    setSelectedPowerball(lineToEdit.powerball);
    setIncludeExtraPlay(lineToEdit.includeExtraPlay);
    setNumberOfDraws(lineToEdit.drawCount);
    setEditingLineIndex(lineIndex);
    setEditMode(true);
    setIsEditingNumber(true);
  };

  const handleToggleExtraPlay = (lineIndex: number, checked: boolean) => {
    const updatedLines = [...savedLines];
    updatedLines[lineIndex].includeExtraPlay = checked;
    setSavedLines(updatedLines);
  };

  const handleChangeDrawCount = (lineIndex: number, count: string) => {
    const updatedLines = [...savedLines];
    updatedLines[lineIndex].drawCount = count;
    setSavedLines(updatedLines);
  };

  const getTicketPrice = () => {
    let price = 0;
    savedLines.forEach(line => {
      let linePrice = basePrice;
      if (line.includeExtraPlay) {
        linePrice += extraPlayPrice;
      }
      price += linePrice * parseInt(line.drawCount || "1");
    });
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace('R$', 'R$ ');
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
      case "[#8CD444]":
        return "#8CD444";
      default:
        return "#000000";
    }
  };

  const colorValue = getColorValue();

  const isLineComplete = () => {
    if (hasPowerball) {
      return selectedNumbers.length === maxRegularNumbers && selectedPowerball !== null;
    } else {
      return selectedNumbers.length === maxRegularNumbers;
    }
  };

  const canUseQuickPick = () => {
    return !isRandomizing && selectedNumbers.length < maxRegularNumbers;
  };
  
  const lineComplete = isLineComplete();
  const shouldDimUnselected = lineComplete && !isEditingNumber;

  const getNumberOpacity = (isSelected: boolean) => {
    if (isSelected) return 1.0;
    
    // Only dim unselected numbers when all numbers are selected (full line)
    if (selectedNumbers.length === maxRegularNumbers) {
      return 0.4;
    }
    
    return 1.0;
  }

  return <GameLayout logoSrc={logoSrc} jackpotAmount={jackpotAmount} colorValue={colorValue} gameName={gameName} ticketPrice={getTicketPrice()} hasLines={savedLines.length > 0}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md overflow-hidden h-full">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Linha {String(getLineCount()).padStart(2, '0')}</h3>
              <Button onClick={handleQuickPick} disabled={isRandomizing} className="text-xs h-8 bg-white border hover:bg-opacity-10 px-6" style={{
                color: colorValue,
                borderColor: colorValue
              }}>
                JOGADA ALEATÓRIA
              </Button>
            </div>

            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Escolha {maxRegularNumbers} Números</p>
              <span className="text-xs font-medium">{selectedNumbers.length} de {maxRegularNumbers}</span>
            </div>
            <div className="mb-3">
              <Progress value={progressValue} className="h-2" style={{
                backgroundColor: "#e5e7eb"
              }} />
            </div>
            
            <div className="grid grid-cols-9 gap-1 mb-4">
              {regularNumbers.map(number => {
                const isSelected = selectedNumbers.includes(number);
                const opacity = getNumberOpacity(isSelected);
                
                return (
                  <button 
                    key={`regular-${number}`} 
                    onClick={() => handleNumberSelect(number)} 
                    disabled={isRandomizing} 
                    style={{
                      alignItems: 'center',
                      backgroundColor: isSelected ? colorValue : '#f0f0f0',
                      borderRadius: '50%',
                      color: isSelected ? 'white' : '#333333',
                      cursor: 'pointer',
                      display: 'flex',
                      fontWeight: 700,
                      height: '3em',
                      justifyContent: 'center',
                      lineHeight: '1',
                      margin: '0.3em',
                      textAlign: 'center',
                      width: '3em',
                      zIndex: 2,
                      opacity: opacity,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      borderRadius: '50%',
                      content: '""',
                      height: '100%',
                      left: 0,
                      top: 0,
                      transform: isSelected ? 'scale(1)' : 'scale(0)',
                      transformOrigin: 'center',
                      transition: 'transform 2s ease-in-out',
                      width: '100%',
                      zIndex: -1,
                      backgroundColor: isSelected ? colorValue : 'transparent'
                    }}></span>
                    <span style={{ 
                      fontSize: '1.10em', 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%', 
                      height: '100%' 
                    }}>{number}</span>
                  </button>
                );
              })}
            </div>

            {hasPowerball && <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Escolha {maxPowerballNumbers} Powerball</p>
                  <span className="text-xs font-medium">{selectedPowerball ? 1 : 0} de {maxPowerballNumbers}</span>
                </div>
                <div className="mb-3">
                  <Progress value={calculatePowerballProgress()} className="h-2" style={{
                    backgroundColor: "#e5e7eb"
                  }} />
                </div>
                <div className="grid grid-cols-9 gap-1 mb-4">
                  {powerballNumbers.map(number => {
                    const isSelected = selectedPowerball === number;
                    const opacity = getNumberOpacity(isSelected);
                    
                    return (
                      <button 
                        key={`powerball-${number}`} 
                        onClick={() => handlePowerballSelect(number)} 
                        disabled={isRandomizing}
                        style={{
                          alignItems: 'center',
                          backgroundColor: isSelected ? 'rgb(245, 158, 11)' : '#f0f0f0',
                          borderRadius: '50%',
                          color: isSelected ? 'white' : '#333333',
                          cursor: 'pointer',
                          display: 'flex',
                          fontWeight: 700,
                          height: '3em',
                          justifyContent: 'center',
                          lineHeight: '1',
                          margin: '0.3em',
                          textAlign: 'center',
                          width: '3em',
                          zIndex: 2,
                          opacity: opacity,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          borderRadius: '50%',
                          content: '""',
                          height: '100%',
                          left: 0,
                          top: 0,
                          transform: isSelected ? 'scale(1)' : 'scale(0)',
                          transformOrigin: 'center',
                          transition: 'transform 2s ease-in-out',
                          width: '100%',
                          zIndex: -1,
                          backgroundColor: isSelected ? 'rgb(245, 158, 11)' : 'transparent'
                        }}></span>
                        <span style={{ 
                          fontSize: '1.10em', 
                          fontWeight: 700, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          width: '100%', 
                          height: '100%' 
                        }}>{number}</span>
                      </button>
                    );
                  })}
                </div>
              </>}
          </div>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden h-full">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Opções de Jogo</h3>
            
            <div className="flex items-center justify-between mt-4 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox id="extraplay" checked={includeExtraPlay} onCheckedChange={checked => setIncludeExtraPlay(checked as boolean)} disabled={isRandomizing} />
                <label htmlFor="extraplay" className="text-sm font-medium">
                  Adicionar {extraPlayName} (+R${extraPlayPrice.toFixed(2)} por linha)
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium block mb-1">Número de Sorteios</label>
              <Select value={numberOfDraws} onValueChange={setNumberOfDraws} disabled={isRandomizing}>
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

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Minhas Linhas</h3>
              
              {savedLines.length === 0 ? <p className="text-sm text-gray-500 mb-3">Nenhuma linha adicionada ainda</p> : savedLines.map((line, index) => <div key={index} className="mb-3">
                    <div className="bg-white rounded p-3 mb-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border" onClick={() => handleEditLine(index)}>
                      <div className="flex items-center">
                        {line.numbers.map((num, i) => <span key={i} className="text-white rounded-full w-7 h-7 flex items-center justify-center text-xs mx-0.5" style={{
                    backgroundColor: colorValue
                  }}>
                            {num}
                          </span>)}
                        {hasPowerball && line.powerball && <span className="bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs ml-1">
                            {line.powerball}
                          </span>}
                      </div>
                      <button onClick={e => {
                  e.stopPropagation();
                  handleRemoveLine(index);
                }} className="text-gray-400 hover:text-gray-600" disabled={isRandomizing}>
                        ✕
                      </button>
                    </div>
                    
                    <div className="bg-gray-100 rounded p-2 pl-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Checkbox id={`extraplay-${index}`} checked={line.includeExtraPlay} onCheckedChange={checked => handleToggleExtraPlay(index, checked as boolean)} disabled={isRandomizing} />
                        <label htmlFor={`extraplay-${index}`} className="text-sm font-medium">
                          Adicionar {extraPlayName}
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Sorteios:</label>
                        <Select value={line.drawCount} onValueChange={value => handleChangeDrawCount(index, value)} disabled={isRandomizing}>
                          <SelectTrigger className="w-24 h-7 text-sm">
                            <SelectValue placeholder="Sorteios" />
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
                  </div>)}
            </div>
          </div>
        </Card>
      </div>
    </GameLayout>;
};

export default PlayPage;
