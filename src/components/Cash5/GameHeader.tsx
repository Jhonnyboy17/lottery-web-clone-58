
import React from "react";

interface GameHeaderProps {
  logoSrc: string;
  gameName: string;
  jackpotAmount: string;
  colorValue: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  logoSrc, 
  gameName, 
  jackpotAmount, 
  colorValue 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <img 
        src={logoSrc} 
        alt={gameName} 
        className="h-12 w-auto"
      />
      <div className="text-right">
        <p className="text-sm font-semibold">JACKPOT</p>
        <h2 className="text-2xl font-bold" style={{ color: colorValue }}>R$ {jackpotAmount}</h2>
      </div>
    </div>
  );
};

export default GameHeader;
