
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
  const shouldShowDrawTimes = jackpotAmount === "500";
  
  return (
    <div className="relative">
      {/* Faixa laranja no topo */}
      <div className="absolute top-0 left-0 w-full h-16 bg-orange-500"></div>
      
      {/* Conteúdo */}
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
              <p className="text-sm font-semibold">JACKPOT</p>
              <h2 className="text-2xl font-bold" style={{ color: colorValue }}>R$ {jackpotAmount}</h2>
            </>
          )}
        </div>
      </div>
      
      {/* Thick wavy orange stripe - using a custom class from tailwind config */}
      <div className="w-full h-6 bg-wave-orange -mb-1"></div>
    </div>
  );
};

export default GameHeader;
