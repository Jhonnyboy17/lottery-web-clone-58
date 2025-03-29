import React from "react";
import Navbar from "./Navbar";
import TotalSummary from "./Cash5/TotalSummary";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
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
  return <div className="min-h-screen bg-white pb-20">
      <Navbar />
      
      {/* Game Banner with Background Color - directly below navbar with proper spacing for logo */}
      <div className="w-full py-8 mt-16" style={{
      backgroundColor: colorValue
    }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Left side - Empty */}
            <div></div>

            {/* Center - Game Logo */}
            <div className="flex justify-center">
              <img src={logoSrc} alt={gameName} className="h-16 w-auto" />
            </div>

            {/* Right side - Jackpot Info */}
            <div className="text-right">
              <p className="text-sm text-white font-extrabold">JACKPOT ESTÁ VALIDO</p>
              <h2 className="text-2xl font-bold text-black">R$ {jackpotAmount}</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Navigation - Now below the banner */}
      <div className="w-full bg-gray-100 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <NavigationMenu className="max-w-none w-auto">
            <NavigationMenuList className="flex space-x-6 justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink href={`/play-${gameName.toLowerCase().replace(/\s+/g, '-')}`} className="text-black hover:text-black/80 font-medium text-sm py-3 px-4 flex items-center">
                  Jogar {gameName}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href={`/results/${gameName.toLowerCase().replace(/\s+/g, '-')}`} className="text-black hover:text-black/80 font-medium text-sm py-3 px-4 flex items-center">
                  Resultados
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-black hover:text-black/80 font-medium text-sm py-3 px-4 flex items-center" href={`/checker/${gameName.toLowerCase().replace(/\s+/g, '-')}`}>
                  Verificador de Números
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href={`/how-to-play/${gameName.toLowerCase().replace(/\s+/g, '-')}`} className="text-black hover:text-black/80 font-medium text-sm py-3 px-4 flex items-center">
                  Como Jogar
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 pt-6 pb-6">
        {/* Main Content */}
        {children}
      </div>

      {/* Sticky Bottom Bar with Total Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="mx-auto max-w-7xl px-3">
          <TotalSummary ticketPrice={ticketPrice} colorValue={colorValue} hasLines={hasLines} />
        </div>
      </div>
    </div>;
};
export default GameLayout;