
import React from "react";
import { Card } from "@/components/ui/card";
import TotalSummary from "./Cash5/TotalSummary";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SavedLineType } from "./Cash5/types";

interface GameLayoutProps {
  children: React.ReactNode;
  logoSrc: string;
  jackpotAmount: string;
  colorValue: string;
  gameName: string;
  ticketPrice: string;
  hasLines: boolean;
  lineCount?: number;
  savedLines?: SavedLineType[];
  onClearLines?: () => void;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  logoSrc,
  jackpotAmount,
  colorValue,
  gameName,
  ticketPrice,
  hasLines,
  lineCount = 0,
  savedLines = [],
  onClearLines,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <Card className="mb-6 border-0 shadow-md overflow-hidden">
          <div className="p-6 bg-white dark:bg-card">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                <img src={logoSrc} alt={gameName} className="h-16 w-auto object-contain mr-4" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{gameName}</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Prêmio estimado: ${jackpotAmount}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-4xl font-bold" style={{ color: colorValue }}>
                  ${jackpotAmount}
                </h2>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  JACKPOT ESTÁ ATIVO
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {children}
        
        <div className="mt-6">
          <TotalSummary 
            ticketPrice={ticketPrice} 
            colorValue={colorValue}
            hasLines={hasLines}
            logoSrc={logoSrc}
            gameName={gameName}
            lineCount={lineCount}
            savedLines={savedLines}
            onClearLines={onClearLines}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GameLayout;
