
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
  // Check if we should display the draw times instead of jackpot amount
  const shouldShowDrawTimes = jackpotAmount === "500";
  
  return (
    <div className="relative">
      {/* Light orange banner at the top - full width */}
      <div className="fixed top-0 left-0 right-0 bg-orange-300 h-24 -z-10"></div>
      
      {/* Content with the same layout */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <img 
          src={logoSrc} 
          alt={gameName} 
          className="h-12 w-auto"
        />
        <div className="text-right">
          {shouldShowDrawTimes ? (
            <>
              <p className="text-xl font-bold" style={{ color: colorValue }}>2 sorteios Diários</p>
              <p className="text-xs font-medium text-gray-700">Sorteio FECHA: 12:35 & 21:15</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">JACKPOT</p>
              <h2 className="text-2xl font-bold" style={{ color: colorValue }}>R$ {jackpotAmount}</h2>
            </>
          )}
        </div>
      </div>
      
      {/* Orange wavy line/stripe */}
      <div className="w-full bg-orange-400 h-2 mb-4"></div>
    </div>
  );
};

export default GameHeader;
