
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
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  
  return `${dayName}, ${monthName} ${day}, 9:59 PM`;
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
  jackpot, 
  className = "" 
}) => {
  // Get the background color for the current game type
  const bgColor = gameColors[gameType] || "bg-purple-600"; // Default to purple if gameType not found
  const textColor = numberTextColors[gameType] || "text-purple-600"; // Default to purple text if gameType not found
  const logoSrc = gameLogos[gameType];
  const formattedDate = getFormattedDate(date);
  const gamePath = getGamePath(gameType);
  
  return (
    <Card className={`overflow-hidden border-0 shadow-lg ${bgColor} ${className}`}>
      <div className="p-5 flex flex-col h-full text-white">
        {/* Logo */}
        <div className="flex justify-center mb-3 h-12">
          {logoSrc && <img src={logoSrc} alt={gameType} className="h-full object-contain" />}
        </div>
        
        {/* Jackpot */}
        <div className="text-center mb-3">
          <div className="text-2xl font-bold">{jackpot}</div>
          <div className="text-xs opacity-75">(Prêmio Estimado)</div>
        </div>
        
        {/* Numbers */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-6">
          {numbers.map((number, index) => (
            <div 
              key={index}
              className="w-8 h-8 rounded-full bg-[#1a0f36] flex items-center justify-center font-bold text-sm text-white"
            >
              {number}
            </div>
          ))}
        </div>
        
        {/* Date */}
        <div className="text-center text-sm mb-4">
          {formattedDate}
        </div>
        
        {/* Buttons */}
        <div className="mt-auto space-y-2">
          <Button 
            asChild
            className={`w-full bg-white hover:bg-opacity-90 font-medium ${textColor}`}
          >
            <Link to={gamePath}>
              VER TODOS
            </Link>
          </Button>
          
          <Button 
            asChild
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white/20"
          >
            <Link to={gamePath}>
              CHEQUE SEUS NÚMEROS
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;
