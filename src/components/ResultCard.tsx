import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDateAsDayMonthYear, getFormattedWeekday } from "@/utils/dateUtils";
import { supabase } from "@/integrations/supabase/client";

interface ResultCardProps {
  date: string;
  gameType: string;
  numbers: number[];
  jackpot?: string;
  className?: string;
  previousDraw?: string;
  previousNumbers?: number[];
  history?: Array<{
    date: string;
    numbers: number[];
  }>;
}

const gameColors: Record<string, string> = {
  "Mega-Sena": "bg-blue-500",
  "Quina": "bg-[#ff5247]",
  "Lotofácil": "bg-[#8CD444]",
  "Lotomania": "bg-[#00ccc6]",
  "Pick 4": "bg-[#ffa039]",
  "Pick 3": "bg-[#ffa039]"
};

const numberTextColors: Record<string, string> = {
  "Mega-Sena": "text-blue-500",
  "Quina": "text-[#ff5247]",
  "Lotofácil": "text-[#8CD444]",
  "Lotomania": "text-[#00ccc6]",
  "Pick 4": "text-[#ffa039]",
  "Pick 3": "text-[#ffa039]"
};

const gameLogos: Record<string, string> = {
  "Mega-Sena": "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
  "Quina": "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
  "Lotofácil": "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
  "Lotomania": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
  "Pick 4": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
  "Pick 3": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png"
};

const getLimitedNumbers = (gameType: string, numbers: number[]) => {
  const limits: Record<string, number> = {
    "Mega-Sena": 6,
    "Quina": 5,
    "Lotofácil": 6,
    "Lotomania": 6,
    "Pick 4": 4,
    "Pick 3": 3
  };
  
  const limit = limits[gameType] || numbers.length;
  return numbers.slice(0, limit);
};

const getGamePath = (gameType: string) => {
  const gameMap: Record<string, string> = {
    "Mega-Sena": "/play-mega-millions",
    "Quina": "/play-powerball",
    "Lotofácil": "/play-lucky-day",
    "Lotomania": "/play-pick4",
    "Pick 4": "/play-cash5",
    "Pick 3": "/play-fast-play"
  };
  
  return gameMap[gameType] || "/";
};

const ResultCard: React.FC<ResultCardProps> = ({ 
  date, 
  gameType, 
  numbers, 
  previousDraw,
  previousNumbers = [],
  history = [],
  className = "" 
}) => {
  const bgColor = gameColors[gameType] || "bg-blue-500";
  const textColor = numberTextColors[gameType] || "text-blue-500";
  const logoSrc = gameLogos[gameType];
  const formattedDate = formatDateAsDayMonthYear(date);
  const dayName = getFormattedWeekday(date);
  const gamePath = getGamePath(gameType);
  
  const limitedCurrentNumbers = getLimitedNumbers(gameType, numbers);
  
  const allHistory = [
    { date, numbers: limitedCurrentNumbers },
    ...(history || []).slice(0, 2)
  ];
  
  React.useEffect(() => {
    const checkResults = async () => {
      try {
        console.log(`Checking for latest results for ${gameType}`);
      } catch (error) {
        console.error(`Error checking results for ${gameType}:`, error);
      }
    };
    
    checkResults();
  }, [gameType]);
  
  return (
    <Card className={`overflow-hidden border-0 shadow-lg w-full ${bgColor} ${className}`}>
      <div className="p-5 flex flex-col h-full min-h-[300px] text-white">
        <div className="flex justify-center mb-3 h-14">
          {logoSrc && <img src={logoSrc} alt={gameType} className="h-full object-contain" />}
        </div>
        
        <div className="text-center mb-4">
          <div className="text-base font-bold">JACKPOT PENDENTE</div>
        </div>
        
        {allHistory.map((item, historyIndex) => (
          <div key={historyIndex} className={`${historyIndex > 0 ? 'border-t border-white/20' : ''} pt-3 pb-3`}>
            <div className="font-semibold text-xl">{getFormattedWeekday(item.date)}</div>
            <div className="text-base text-white/80 mb-3">{formatDateAsDayMonthYear(item.date)}</div>
            
            <div className="flex flex-wrap gap-3 justify-start mb-3">
              {getLimitedNumbers(gameType, item.numbers).map((number, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 rounded-full bg-[#1a0f36] flex items-center justify-center font-bold text-lg text-white"
                >
                  {number}
                </div>
              ))}
              {item.numbers.length > 0 && (
                <div className="text-sm self-center font-light">
                  ×{item.numbers.length > 5 ? "5" : "2"}
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-auto flex flex-col gap-3 border-t border-white/20 pt-4">
          <Button 
            asChild
            className="w-full bg-[#1a0f36] hover:bg-[#2a1b4e] font-medium text-white text-base py-2 h-auto"
          >
            <Link to={gamePath}>
              Ver todos resultados
            </Link>
          </Button>
          
          <Button 
            asChild
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white/20 text-base py-2 h-auto"
          >
            <Link to={gamePath}>
              Jogar
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;
