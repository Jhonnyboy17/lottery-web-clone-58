
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

const gameColors: Record<string, string> = {
  "Mega-Sena": "bg-blue-600",
  "Quina": "bg-purple-600",
  "Lotofácil": "bg-green-500",
  "Lotomania": "bg-teal-400",
  "Pick 4": "bg-amber-500",
  "Pick 3": "bg-orange-400"
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
  const bgColor = gameColors[gameType] || "bg-purple-800";
  const logoSrc = gameLogos[gameType];
  const formattedDate = getFormattedDate(date);
  const gamePath = getGamePath(gameType);
  
  return (
    <Card className={`results-card overflow-hidden border-0 shadow-lg ${bgColor} ${className}`}>
      <div className="p-6 flex flex-col h-full text-white">
        {/* Logo */}
        <div className="flex justify-center mb-4 h-16">
          {logoSrc && <img src={logoSrc} alt={gameType} className="h-full object-contain" />}
        </div>
        
        {/* Jackpot */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold">{jackpot}</div>
          <div className="text-xs opacity-75">(Prêmio Estimado)</div>
        </div>
        
        {/* Numbers */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {numbers.map((number, index) => (
            <div 
              key={index}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-purple-900"
            >
              {number}
            </div>
          ))}
        </div>
        
        {/* Date */}
        <div className="text-center text-sm mb-6">
          {formattedDate}
        </div>
        
        {/* Play Button */}
        <div className="mt-auto">
          <Button 
            asChild
            className="w-full bg-opacity-20 hover:bg-opacity-30 bg-white text-white border border-white/20"
          >
            <Link to={gamePath}>
              JOGAR
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;
