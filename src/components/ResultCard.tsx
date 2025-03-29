
import React from "react";
import { Card } from "@/components/ui/card";

interface ResultCardProps {
  date: string;
  gameType: string;
  numbers: number[];
  jackpot?: string;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  date, 
  gameType, 
  numbers, 
  jackpot, 
  className = "" 
}) => {
  return (
    <Card className={`results-card border-0 shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 flex flex-col h-full">
        <div className="text-sm text-gray-200 mb-2">{date}</div>
        <h3 className="font-bold text-lg mb-4 text-white">{gameType}</h3>
        
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {numbers.map((number, index) => (
            <div 
              key={index}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-purple-900"
            >
              {number}
            </div>
          ))}
        </div>
        
        {jackpot && (
          <div className="mt-auto pt-2 border-t border-purple-700">
            <div className="text-xs text-gray-300">Prêmio Estimado</div>
            <div className="font-bold text-green-400">{jackpot}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResultCard;
