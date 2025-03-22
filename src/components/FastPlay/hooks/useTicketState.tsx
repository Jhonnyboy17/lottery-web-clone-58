
import { useState, useEffect } from "react";
import { NumberSelectionType } from "../types";

export const useTicketState = () => {
  const [currentLine, setCurrentLine] = useState<NumberSelectionType>({
    digits: [null, null, null], // 3 dígitos em vez de 4
    playType: "Straight",
    betAmount: "R$8",
  });
  
  const [savedLines, setSavedLines] = useState<NumberSelectionType[]>([]);
  const [lineCount, setLineCount] = useState(1);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(null);
  const [includeFireball, setIncludeFireball] = useState(false);
  const [selectedDrawTime, setSelectedDrawTime] = useState<string>("Meio-dia");
  const [selectedDrawCount, setSelectedDrawCount] = useState<number>(1);

  // Resetar o estado quando o tipo de jogo mudar
  useEffect(() => {
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      // Se for Back Pair ou Front Pair, marcar o primeiro dígito como X
      setCurrentLine(prev => ({
        ...prev,
        digits: ["X", null, null]
      }));
    } else {
      // Para outros tipos, resetar para todos null
      setCurrentLine(prev => ({
        ...prev,
        digits: [null, null, null]
      }));
    }
    setActiveDigitIndex(null);
  }, [currentLine.playType]);

  const handlePlayTypeChange = (playType: string) => {
    setCurrentLine(prev => ({
      ...prev,
      playType
    }));
  };

  const handleBetAmountChange = (betAmount: string) => {
    setCurrentLine(prev => ({
      ...prev,
      betAmount
    }));
  };

  const handleDigitSelect = (digit: number) => {
    if (activeDigitIndex === null) return;
    
    // Impedir seleção do primeiro dígito se for Back Pair ou Front Pair
    if ((currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") && activeDigitIndex === 0) {
      return;
    }
    
    const newDigits = [...currentLine.digits];
    newDigits[activeDigitIndex] = digit;
    
    setCurrentLine(prev => ({
      ...prev,
      digits: newDigits
    }));

    // Avançar para o próximo dígito disponível
    const nextIndex = findNextEmptyIndex(newDigits);
    setActiveDigitIndex(nextIndex);
  };

  const findNextEmptyIndex = (digits: (number | null | "X")[]) => {
    for (let i = 0; i < digits.length; i++) {
      // Pular o primeiro dígito se for pair selection
      if ((currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") && i === 0) {
        continue;
      }
      if (digits[i] === null) {
        return i;
      }
    }
    return null;
  };

  const handleQuickPick = () => {
    const newDigits: (number | null | "X")[] = [...currentLine.digits];
    
    // Se for Back Pair ou Front Pair, o primeiro dígito é X
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      newDigits[0] = "X";
      
      // Gerar números para os outros dígitos
      for (let i = 1; i < newDigits.length; i++) {
        newDigits[i] = Math.floor(Math.random() * 10);
      }
    } else {
      // Para outros tipos, gerar números para todos os dígitos
      for (let i = 0; i < newDigits.length; i++) {
        newDigits[i] = Math.floor(Math.random() * 10);
      }
    }
    
    setCurrentLine(prev => ({
      ...prev,
      digits: newDigits
    }));
    
    setActiveDigitIndex(null);
  };

  const clearSelections = () => {
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      setCurrentLine(prev => ({
        ...prev,
        digits: ["X", null, null]
      }));
    } else {
      setCurrentLine(prev => ({
        ...prev,
        digits: [null, null, null]
      }));
    }
    setActiveDigitIndex(null);
  };

  const handleAddLine = () => {
    setSavedLines(prev => [...prev, currentLine]);
    setLineCount(prev => prev + 1);
    
    // Resetar linha atual
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      setCurrentLine(prev => ({
        ...prev,
        digits: ["X", null, null]
      }));
    } else {
      setCurrentLine(prev => ({
        ...prev,
        digits: [null, null, null]
      }));
    }
    
    setActiveDigitIndex(null);
  };

  const handleRemoveLine = (index: number) => {
    setSavedLines(prev => prev.filter((_, i) => i !== index));
  };

  const isLineComplete = (): boolean => {
    if (currentLine.playType === "Back Pair" || currentLine.playType === "Front Pair") {
      // Para pares, verificamos se os dígitos 1 e 2 estão preenchidos
      return currentLine.digits[1] !== null && currentLine.digits[2] !== null;
    } else {
      // Para outros tipos, todos os dígitos devem estar preenchidos
      return currentLine.digits.every(digit => digit !== null);
    }
  };

  const getTicketPrice = (): number => {
    const basePrice = 1.00; // R$1.00 por linha
    let total = savedLines.length * basePrice;
    
    // Adicionar preço do Fireball se selecionado
    if (includeFireball && savedLines.length > 0) {
      total += 1.00;
    }
    
    // Multiplicar pelo número de sorteios
    total *= selectedDrawCount;
    
    return total;
  };

  return {
    currentLine,
    savedLines,
    lineCount,
    includeFireball,
    activeDigitIndex,
    selectedDrawTime,
    selectedDrawCount,
    setActiveDigitIndex,
    handleDigitSelect,
    handlePlayTypeChange,
    handleBetAmountChange,
    handleQuickPick,
    clearSelections,
    handleAddLine,
    handleRemoveLine,
    setIncludeFireball,
    setSelectedDrawTime,
    setSelectedDrawCount,
    isLineComplete,
    getTicketPrice
  };
};
