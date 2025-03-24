
import React from "react";
import Navbar from "./Navbar";
import TotalSummary from "./Cash5/TotalSummary";

interface GameLayoutProps {
  logoSrc: string;
  jackpotAmount: string;
  colorValue: string;
  gameName: string;
  ticketPrice: string;
  hasLines: boolean;
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  logoSrc,
  jackpotAmount,
  colorValue,
  gameName,
  ticketPrice,
  hasLines,
  children
}) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl pt-24 px-3 pb-6">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <img 
              src={logoSrc} 
              alt={gameName} 
              className="h-12 w-auto mb-2"
            />
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-black">JACKPOT ESTA VALIDO</p>
            <h2 className="text-2xl font-bold" style={{ color: colorValue }}>R$ {jackpotAmount}</h2>
          </div>
        </div>

        {/* Main Content */}
        {children}

        {/* Total Summary */}
        <div className="mt-4">
          <TotalSummary 
            ticketPrice={ticketPrice} 
            colorValue={colorValue} 
            hasLines={hasLines} 
          />
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
