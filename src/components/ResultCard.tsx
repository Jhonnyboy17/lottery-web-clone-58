import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDateAsDayMonthYear, getFormattedWeekday } from "@/utils/dateUtils";

interface ResultCardProps {
  date: string;
  gameType: string;
  numbers: number[];
  jackpot?: string;
  className?: string;
  previousDraw?: string; // Previous draw date
  previousNumbers?: number[]; // Add previous draw numbers
  history?: Array<{
    date: string;
    numbers: number[];
  }>;
}

// Define game colors explicitly using Tailwind classes - Updated colors to match index page
const gameColors: Record<string, string> = {
  "Mega-Sena": "bg-blue-500",      // Blue for Mega-Sena (formerly green-600)
  "Quina": "bg-[#ff5247]",         // Red for Quina (formerly purple-600)
  "Lotofácil": "bg-[#8CD444]",     // Darker green for Lotofácil (formerly lime-500)
  "Lotomania": "bg-[#00ccc6]",     // Cyan/Blue for Lotomania (formerly orange-500)
  "Pick 4": "bg-[#ffa039]",        // Amber/Yellow for Pick 4 (formerly amber-500)
  "Pick 3": "bg-[#ffa039]"         // Amber/Yellow for Pick 3 (formerly red-500)
};

// Define text colors for the number balls based on game type
const numberTextColors: Record<string, string> = {
  "Mega-Sena": "text-blue-500",
  "Quina": "text-[#ff5247]",
  "Lotofácil": "text-[#8CD444]",
  "Lotomania": "text-[#00ccc6]",
  "Pick 4": "text-[#ffa039]",
  "Pick 3": "text-[#ffa039]"
};

// Define game logos explicitly using Tailwind classes
const gameLogos: Record<string, string> = {
  "Mega-Sena": "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png", // Updated Mega Millions logo
  "Quina": "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png", // Powerball logo
  "Lotofácil": "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png", // Illinois Lotto logo
  "Lotomania": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png", // Lucky Day logo
  "Pick 4": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png", // Pick 4 logo
  "Pick 3": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png" // Pick 3 logo (using same as Pick 4 for now)
};

// Function to limit the number of balls based on game type
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
  // Get the background color for the current game type
  const bgColor = gameColors[gameType] || "bg-blue-500"; // Default to blue if gameType not found
  const textColor = numberTextColors[gameType] || "text-blue-500"; // Default to blue text if gameType not found
  const logoSrc = gameLogos[gameType];
  const formattedDate = formatDateAsDayMonthYear(date);
  const dayName = getFormattedWeekday(date);
  const gamePath = getGamePath(gameType);
  
  // Limit the number of balls based on game type
  const limitedCurrentNumbers = getLimitedNumbers(gameType, numbers);
  
  // Get all history items including the current numbers
  const allHistory = [
    { date, numbers: limitedCurrentNumbers },
    ...(history || []).slice(0, 3) // Get only 3 historical items to show a total of 4 (current + 3 past)
  ];
  
  return (
    <Card className={`overflow-hidden border-0 shadow-lg ${bgColor} ${className}`}>
      <div className="p-2 flex flex-col h-full text-white">
        {/* Logo */}
        <div className="flex justify-center mb-1 h-8">
          {logoSrc && <img src={logoSrc} alt={gameType} className="h-full object-contain" />}
        </div>
        
        {/* Jackpot Pending or Main Info */}
        <div className="text-center mb-1">
          <div className="text-sm font-bold">JACKPOT PENDING</div>
        </div>
        
        {/* Game History */}
        {allHistory.map((item, historyIndex) => (
          <div key={historyIndex} className={`${historyIndex > 0 ? 'border-t border-white/20' : ''} pt-1.5 pb-1`}>
            <div className="font-semibold text-sm">{getFormattedWeekday(item.date)}</div>
            <div className="text-xs text-white/80 mb-1">{formatDateAsDayMonthYear(item.date)}</div>
            
            {/* Numbers for this draw */}
            <div className="flex flex-wrap gap-1 justify-start mb-1.5">
              {getLimitedNumbers(gameType, item.numbers).map((number, index) => (
                <div 
                  key={index}
                  className="w-6 h-6 rounded-full bg-[#1a0f36] flex items-center justify-center font-bold text-xs text-white"
                >
                  {number}
                </div>
              ))}
              {item.numbers.length > 0 && (
                <div className="text-xs self-center font-light">
                  ×{item.numbers.length > 5 ? "5" : "2"}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Buttons */}
        <div className="mt-auto flex gap-2 border-t border-white/20 pt-1.5">
          <Button 
            asChild
            className="flex-1 bg-[#1a0f36] hover:bg-[#2a1b4e] font-medium text-white text-xs px-2 py-1 h-auto"
          >
            <Link to={gamePath}>
              View all results
            </Link>
          </Button>
          
          <Button 
            asChild
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white/20 text-xs px-2 py-1 h-auto"
          >
            <Link to={gamePath}>
              Check your numbers
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;
