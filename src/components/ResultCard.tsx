
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ResultCardProps {
  date: string;
  gameType: string;
  numbers: number[];
  jackpot?: string;
  className?: string;
  previousDraw?: string; // Previous draw date
  previousNumbers?: number[]; // Add previous draw numbers
}

// Define game colors explicitly using Tailwind classes
const gameColors: Record<string, string> = {
  "Mega-Sena": "bg-green-600",    // Green for Mega-Sena
  "Quina": "bg-purple-600",       // Purple for Quina
  "Lotofácil": "bg-lime-500",     // Bright Green for Lotofácil
  "Lotomania": "bg-orange-500",   // Orange for Lotomania
  "Pick 4": "bg-amber-500",       // Amber for Pick 4
  "Pick 3": "bg-red-500"          // Red for Pick 3
};

// Define text colors for the number balls based on game type
const numberTextColors: Record<string, string> = {
  "Mega-Sena": "text-green-600",
  "Quina": "text-purple-600",
  "Lotofácil": "text-lime-500",
  "Lotomania": "text-orange-500",
  "Pick 4": "text-amber-500",
  "Pick 3": "text-red-500"
};

const gameLogos: Record<string, string> = {
  "Mega-Sena": "/lovable-uploads/8b7ebe33-b3af-45c9-b98b-7d363835a20d.png", // Mega Millions logo
  "Quina": "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png", // Powerball logo
  "Lotofácil": "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png", // Illinois Lotto logo
  "Lotomania": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png", // Lucky Day logo
  "Pick 4": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png", // Pick 4 logo
  "Pick 3": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png" // Pick 3 logo (using same as Pick 4 for now)
};

const getFormattedDate = (dateString: string) => {
  const days = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
  const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  
  const dateParts = dateString.split('/');
  const date = new Date(
    parseInt(dateParts[2]), // year
    parseInt(dateParts[1]) - 1, // month (0-based)
    parseInt(dateParts[0]) // day
  );
  
  // Get day name (e.g., "Friday")
  const dayName = days[date.getDay()];
  
  // Format as "Mar 28 2025"
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return {
    dayName: dayName,
    shortDate: `${monthName} ${day} ${year}`
  };
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
  className = "" 
}) => {
  // Get the background color for the current game type
  const bgColor = gameColors[gameType] || "bg-purple-600"; // Default to purple if gameType not found
  const textColor = numberTextColors[gameType] || "text-purple-600"; // Default to purple text if gameType not found
  const logoSrc = gameLogos[gameType];
  const formattedCurrentDate = getFormattedDate(date);
  const formattedPreviousDate = previousDraw ? getFormattedDate(previousDraw) : null;
  const gamePath = getGamePath(gameType);
  
  return (
    <Card className={`overflow-hidden border-0 shadow-lg ${bgColor} ${className}`}>
      <div className="p-5 flex flex-col h-full text-white">
        {/* Logo */}
        <div className="flex justify-center mb-4 h-12">
          {logoSrc && <img src={logoSrc} alt={gameType} className="h-full object-contain" />}
        </div>
        
        {/* Jackpot Pending or Main Info */}
        <div className="text-center mb-4">
          <div className="text-xl font-bold">JACKPOT PENDING</div>
        </div>
        
        {/* Current Draw */}
        <div className="border-t border-white/20 pt-4">
          <div className="font-semibold text-lg">{formattedCurrentDate.dayName}</div>
          <div className="text-sm text-white/70 mb-3">{formattedCurrentDate.shortDate}</div>
          
          {/* Numbers for current draw */}
          <div className="flex flex-wrap gap-2 justify-start mb-5">
            {numbers.map((number, index) => (
              <div 
                key={index}
                className="w-9 h-9 rounded-full bg-[#1a0f36] flex items-center justify-center font-bold text-sm text-white"
              >
                {number}
              </div>
            ))}
            {numbers.length > 0 && (
              <div className="text-sm self-center font-light">
                ×{numbers.length > 5 ? "5" : "2"}
              </div>
            )}
          </div>
        </div>
        
        {/* Previous Draw */}
        {previousDraw && (
          <div className="border-t border-white/20 pt-4">
            <div className="font-semibold text-lg">{formattedPreviousDate?.dayName}</div>
            <div className="text-sm text-white/70 mb-3">{formattedPreviousDate?.shortDate}</div>
            
            {/* Numbers for previous draw (if available) */}
            <div className="flex flex-wrap gap-2 justify-start mb-5">
              {previousNumbers.length > 0 ? (
                <>
                  {previousNumbers.map((number, index) => (
                    <div 
                      key={index}
                      className="w-9 h-9 rounded-full bg-[#1a0f36] flex items-center justify-center font-bold text-sm text-white"
                    >
                      {number}
                    </div>
                  ))}
                  <div className="text-sm self-center font-light">
                    ×{previousNumbers.length > 5 ? "5" : "2"}
                  </div>
                </>
              ) : (
                <div className="text-sm text-white/70">No numbers available</div>
              )}
            </div>
          </div>
        )}
        
        {/* Buttons */}
        <div className="mt-auto flex gap-3 border-t border-white/20 pt-4">
          <Button 
            asChild
            className="flex-1 bg-[#1a0f36] hover:bg-[#2a1b4e] font-medium text-white"
          >
            <Link to={gamePath}>
              View all results
            </Link>
          </Button>
          
          <Button 
            asChild
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white/20"
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
