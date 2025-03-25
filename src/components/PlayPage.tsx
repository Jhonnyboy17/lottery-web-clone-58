import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SavedLineType } from "./Cash5/types";
import GameLayout from "./GameLayout";
import { X } from "lucide-react";

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
    // This empty effect ensures that the component re-renders after mount
  }, []);

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
    
    let newSelectedNumbers;
    if (selectedNumbers.includes(number)) {
      newSelectedNumbers = selectedNumbers.filter(n => n !== number);
      setSelectedNumbers(newSelectedNumbers);
    } else if (selectedNumbers.length < maxRegularNumbers) {
      newSelectedNumbers = [...selectedNumbers, number];
      setSelectedNumbers(newSelectedNumbers);
    } else {
      newSelectedNumbers = selectedNumbers;
    }
    
    if (editingLineIndex !== null) {
      const updatedLines = [...savedLines];
      updatedLines[editingLineIndex] = {
        ...updatedLines[editingLineIndex],
        numbers: newSelectedNumbers
      };
      setSavedLines(updatedLines);
    }
    
    setTimeout(() => {
      setIsNumberClicked(false);
      
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
    
    let newPowerball;
    if (selectedPowerball === number) {
      newPowerball = null;
      setSelectedPowerball(null);
    } else {
      newPowerball = number;
      setSelectedPowerball(number);
    }
    
    if (editingLineIndex !== null) {
      const updatedLines = [...savedLines];
      updatedLines[editingLineIndex] = {
        ...updatedLines[editingLineIndex],
        powerball: newPowerball
      };
      setSavedLines(updatedLines);
    }
    
    setTimeout(() => {
      setIsNumberClicked(false);
      
      if (!editMode) {
        setTimeout(() => {
          setIsEditingNumber(false);
        }, 300);
      }
    }, 2000);
  };

  const handleQuickPick = () => {
    if (isRandomizing) return;
    
    // Set cooldown and animation flags
    const selectedCount = selectedNumbers.length;
    let newCooldownTime = 4 - selectedCount; // Adjust cooldown based on how many numbers are already selected
    if (newCooldownTime < 1) newCooldownTime = 1;
    
    setCooldownTime(newCooldownTime);
    setIsRandomizing(true);
    setIsAnimating(true);
    setIsEditingNumber(true);
    
    // If all slots are filled, clear the selection and start fresh
    if (selectedNumbers.length === maxRegularNumbers) {
      setSelectedNumbers([]);
      if (hasPowerball) {
        setSelectedPowerball(null);
      }
      
      // If editing, update the saved line to reflect cleared selection
      if (editingLineIndex !== null) {
        const updatedLines = [...savedLines];
        updatedLines[editingLineIndex] = {
          ...updatedLines[editingLineIndex],
          numbers: [],
          powerball: null
        };
        setSavedLines(updatedLines);
      }
    }
    
    // Get current selections after potential clearing
    const existingNumbers = [...selectedNumbers];
    let remainingPowerball = selectedPowerball;
    
    // Generate random numbers only for the empty slots
    const availableNumbers = Array.from({length: totalRegularNumbers}, (_, i) => i + 1)
      .filter(num => !existingNumbers.includes(num));
    
    const emptySlots = maxRegularNumbers - existingNumbers.length;
    const randomNumbers = [];
    
    // Fill in random numbers for the empty slots
    for (let i = 0; i < emptySlots; i++) {
      if (availableNumbers.length) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        randomNumbers.push(availableNumbers[randomIndex]);
        availableNumbers.splice(randomIndex, 1);
      }
    }
    
    // Generate random powerball if needed and not already selected
    let randomPowerball: number | null = null;
    if (hasPowerball && remainingPowerball === null) {
      randomPowerball = Math.floor(Math.random() * totalPowerballNumbers) + 1;
    }
    
    // Add the numbers one by one with animation
    randomNumbers.forEach((num, index) => {
      setTimeout(() => {
        setSelectedNumbers(prev => [...prev, num]);
        
        // If we're editing an existing line, update it immediately with the partial selection
        if (editingLineIndex !== null) {
          const updatedLines = [...savedLines];
          updatedLines[editingLineIndex] = {
            ...updatedLines[editingLineIndex],
            numbers: [...existingNumbers, ...randomNumbers.slice(0, index + 1)]
          };
          setSavedLines(updatedLines);
        }
        
        if (index === randomNumbers.length - 1) {
          // All regular numbers have been set
          
          // If there's no powerball needed or powerball is already selected, finish the animation
          if (!hasPowerball || remainingPowerball !== null) {
            // If editing, update the saved line with the complete set of numbers
            if (editingLineIndex !== null) {
              const updatedLines = [...savedLines];
              updatedLines[editingLineIndex] = {
                ...updatedLines[editingLineIndex],
                numbers: [...existingNumbers, ...randomNumbers],
                powerball: remainingPowerball
              };
              setSavedLines(updatedLines);
            }
            
            setTimeout(() => {
              setIsRandomizing(false);
              setTimeout(() => {
                if (!editMode) {
                  setIsEditingNumber(false);
                }
              }, 300);
            }, 300);
          }
        }
      }, (index + 1) * 150);
    });
    
    // Handle powerball generation if needed and not already selected
    if (hasPowerball && remainingPowerball === null) {
      setTimeout(() => {
        const randomPowerball = Math.floor(Math.random() * totalPowerballNumbers) + 1;
        setSelectedPowerball(randomPowerball);
        
        // If editing, update the saved line with both the numbers and powerball
        if (editingLineIndex !== null) {
          const updatedLines = [...savedLines];
          updatedLines[editingLineIndex] = {
            ...updatedLines[editingLineIndex],
            numbers: [...existingNumbers, ...randomNumbers],
            powerball: randomPowerball
          };
          setSavedLines(updatedLines);
        }
        
        setTimeout(() => {
          setIsRandomizing(false);
          setTimeout(() => {
            if (!editMode) {
              setIsEditingNumber(false);
            }
          }, 300);
        }, 300);
      }, (randomNumbers.length + 1) * 150);
    }
    
    // If no random numbers need to be added (all slots are filled)
    if (randomNumbers.length === 0 && (remainingPowerball !== null || !hasPowerball)) {
      setTimeout(() => {
        setIsRandomizing(false);
        setTimeout(() => {
          if (!editMode) {
            setIsEditingNumber(false);
          }
        }, 300);
      }, 300);
    }
  };

  const handleAddLine = () => {
    if (selectedNumbers.length === maxRegularNumbers && (!hasPowerball || selectedPowerball !== null)) {
      if (editingLineIndex !== null) {
        const updatedLines = [...savedLines];
        updatedLines[editingLineIndex] = {
          numbers: [...selectedNumbers],
          powerball: selectedPowerball,
          includeExtraPlay: updatedLines[editingLineIndex].includeExtraPlay,
          drawCount: updatedLines[editingLineIndex].drawCount
        };
        setSavedLines(updatedLines);
        setEditingLineIndex(null);
      } else {
        setSavedLines([...savedLines, {
          numbers: [...selectedNumbers],
          powerball: selectedPowerball,
          includeExtraPlay: false,
          drawCount: "1"
        }]);
      }
      setSelectedNumbers([]);
      setSelectedPowerball(null);
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
      setEditMode(false);
      setIsEditingNumber(false);
    }
  };

  const handleEditLine = (lineIndex: number) => {
    const lineToEdit = savedLines[lineIndex];
    setSelectedNumbers([...lineToEdit.numbers]);
    setSelectedPowerball(lineToEdit.powerball);
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

  const getLightColorValue = () => {
    switch (primaryColor) {
      case "blue-600":
        return "#E6F7FF";
      case "red-600":
        return "#FEE2E2";
      case "green-600":
        return "#ECFDF5";
      case "cyan-600":
        return "#E0FDFF";
      case "amber-500":
        return "#FEF3C7";
      case "[#8CD444]":
        return "#F0FEE4";
      default:
        return "#F5F5F5";
    }
  };

  const lightColorValue = getLightColorValue();

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
    
    if (selectedNumbers.length === maxRegularNumbers) {
      return 0.4;
    }
    
    return 1.0;
  }

  const handleStartNewLine = () => {
    setEditingLineIndex(null);
    setSelectedNumbers([]);
    setSelectedPowerball(null);
    setProgressValue(0);
    setIsAnimating(false);
    setEditMode(false);
    setIsEditingNumber(false);
  };

  return <GameLayout logoSrc={logoSrc} jackpotAmount={jackpotAmount} colorValue={colorValue} gameName={gameName} ticketPrice={getTicketPrice()} hasLines={savedLines.length > 0}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md overflow-hidden h-full">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Linha {String(getLineCount()).padStart(2, '0')}</h3>
              <Button 
                onClick={handleQuickPick} 
                disabled={isRandomizing} 
                className="text-xs h-8 px-6 bg-white hover:bg-opacity-10 rounded-full"
                style={{
                  color: colorValue,
                  border: `1px solid ${colorValue}`,
                  backgroundColor: "white",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = lightColorValue;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
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
            <h3 className="font-semibold mb-3">Minhas Linhas</h3>
              
            {savedLines.length === 0 && !selectedNumbers.length ? (
              <div className="mb-2">
                <div 
                  className="bg-white rounded p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={handleStartNewLine}
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 font-medium w-6 mr-2">
                      01
                    </span>
                    {Array(maxRegularNumbers).fill(null).map((_, i) => (
                      <span 
                        key={i} 
                        className="bg-white border border-gray-200 text-gray-600 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5"
                      >
                        ?
                      </span>
                    ))}
                    {hasPowerball && (
                      <span 
                        className="bg-white border border-gray-200 text-gray-600 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm ml-1"
                      >
                        ?
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {savedLines.map((line, index) => (
                  <div key={index} className="mb-2">
                    <div className={`rounded p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      editingLineIndex === index ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleEditLine(index)}>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium w-6 mr-2">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {line.numbers.map((num, i) => (
                          <span 
                            key={i} 
                            className="text-white rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5" 
                            style={{ backgroundColor: colorValue }}
                          >
                            {num}
                          </span>
                        ))}
                        {hasPowerball && line.powerball && (
                          <span className="bg-amber-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm ml-1">
                            {line.powerball}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveLine(index);
                        }} 
                        className="text-gray-400 hover:text-gray-600" 
                        disabled={isRandomizing}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mb-2">
                  <div 
                    className={`rounded p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      editingLineIndex === null ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={handleStartNewLine}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 font-medium w-6 mr-2">
                        {String(savedLines.length + 1).padStart(2, '0')}
                      </span>
                      {Array(maxRegularNumbers).fill(null).map((_, i) => (
                        <span 
                          key={i} 
                          className="bg-white border border-gray-200 text-gray-600 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm mx-0.5"
                        >
                          {/* Only show selected numbers when not editing an existing line */}
                          {editingLineIndex === null && selectedNumbers[i] !== undefined ? (
                            <span className="bg-blue-500 text-white w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: colorValue }}>
                              {selectedNumbers[i]}
                            </span>
                          ) : '?'}
                        </span>
                      ))}
                      {hasPowerball && (
                        <span 
                          className="bg-white border border-gray-200 text-gray-600 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm ml-1"
                        >
                          {/* Only show selected powerball when not editing an existing line */}
                          {editingLineIndex === null && selectedPowerball !== null ? (
                            <span className="bg-amber-500 text-white w-full h-full rounded-full flex items-center justify-center">
                              {selectedPowerball}
                            </span>
                          ) : '?'}
                        </span>
                      )}
                    </div>
                    <div className="w-4"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </GameLayout>;
};

export default PlayPage;
