
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
  const shouldShowDrawTimes = jackpotAmount === "500" || jackpotAmount === "5.000";
  
  return (
    <div className="relative">
      {/* Simple horizontal line that spans the full width */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 w-screen -z-10"></div>
      
      {/* Content with logo */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-6 pb-4">
        <div className="flex-1">
          <img 
            src={logoSrc} 
            alt={gameName} 
            className="h-16 w-auto mx-auto mb-2"
          />
        </div>
        <div className="text-right">
          {shouldShowDrawTimes ? (
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: colorValue }}>2 sorteios Diários</p>
              <p className="text-sm font-medium text-gray-700">Sorteio FECHA: 12:35 & 21:15</p>
            </div>
          ) : (
            <>
              <p className="text-xl font-bold text-black">JACKPOT ESTA VALIDO</p>
              <h2 className="text-2xl font-bold" style={{ color: colorValue }}>$ {jackpotAmount}</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
