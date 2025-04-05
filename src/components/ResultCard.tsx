import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDateAsDayMonthYear, getFormattedWeekday } from "@/utils/dateUtils";
import { supabase } from "@/integrations/supabase/client";
import { LotteryResultRow, toLotteryResult } from "@/integrations/supabase/lottery-types";

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
  "Mega Millions": "bg-blue-500",
  "Powerball": "bg-[#ff5247]",
  "Lucky Day Lotto": "bg-[#8CD444]",
  "Lotto": "bg-[#00ccc6]",
  "Pick 4": "bg-[#ffa039]",
  "Pick 3": "bg-[#ffa039]"
};

const numberTextColors: Record<string, string> = {
  "Mega Millions": "text-blue-500",
  "Powerball": "text-[#ff5247]",
  "Lucky Day Lotto": "text-[#8CD444]",
  "Lotto": "text-[#00ccc6]",
  "Pick 4": "text-[#ffa039]",
  "Pick 3": "text-[#ffa039]"
};

const gameLogos: Record<string, string> = {
  "Mega Millions": "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
  "Powerball": "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
  "Lucky Day Lotto": "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
  "Lotto": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
  "Pick 4": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
  "Pick 3": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png"
};

const getLimitedNumbers = (gameType: string, numbers: number[]) => {
  const limits: Record<string, number> = {
    "Mega Millions": 6,
    "Powerball": 5,
    "Lucky Day Lotto": 6,
    "Lotto": 6,
    "Pick 4": 4,
    "Pick 3": 3
  };
  
  const limit = limits[gameType] || numbers.length;
  return numbers.slice(0, limit);
};

const getGamePath = (gameType: string) => {
  const gameMap: Record<string, string> = {
    "Mega Millions": "/play-mega-millions",
    "Powerball": "/play-powerball",
    "Lucky Day Lotto": "/play-lucky-day",
    "Lotto": "/play-pick4",
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
  
  const [gameHistory, setGameHistory] = useState<Array<{date: string, numbers: number[]}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchGameHistory = async () => {
      if (history.length > 0) {
        setGameHistory(history);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('lottery_results')
          .select('*')
          .eq('game_type', gameType)
          .order('draw_date', { ascending: false })
          .limit(3) as any;
        
        if (error) {
          console.error("Error fetching game history:", error);
          setIsLoading(false);
          return;
        }
        
        const historyData = (data as LotteryResultRow[]).map(item => {
          const lotteryResult = toLotteryResult(item);
          return {
            date: lotteryResult.draw_date,
            numbers: lotteryResult.numbers
          };
        });
        
        setGameHistory(historyData);
      } catch (err) {
        console.error("Error processing game history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGameHistory();
  }, [gameType, history]);
  
  const limitedCurrentNumbers = getLimitedNumbers(gameType, numbers);
  
  const allHistory = gameHistory.length > 0 
    ? gameHistory 
    : [{ date, numbers: limitedCurrentNumbers }, ...(history || []).slice(0, 2)];
  
  const displayHistory = allHistory.slice(0, 3);
  
  return (
    <Card className={`overflow-hidden border-0 shadow-lg w-full ${bgColor} ${className}`}>
      <div className="p-5 flex flex-col h-full min-h-[300px] text-white">
        <div className="flex justify-center mb-3 h-14">
          {logoSrc && <img src={logoSrc} alt={gameType} className="h-full object-contain" />}
        </div>
        
        <div className="text-center mb-4">
          <div className="text-base font-bold">JACKPOT PENDENTE</div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <p>Carregando histórico...</p>
          </div>
        ) : (
          <>
            {displayHistory.map((item, historyIndex) => (
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
          </>
        )}
        
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
