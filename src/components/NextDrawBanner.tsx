
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatUtils";

interface NextDrawBannerProps {
  gameName: string;
  logoSrc: string;
  jackpotAmount: string | number;
  drawDate: string;
  timeRemaining: string;
  route: string;
}

const NextDrawBanner: React.FC<NextDrawBannerProps> = ({
  gameName,
  logoSrc,
  jackpotAmount,
  drawDate,
  timeRemaining,
  route
}) => {
  // Format jackpot amount if it's a number
  const formattedJackpot = typeof jackpotAmount === 'number' 
    ? formatCurrency(jackpotAmount) 
    : jackpotAmount;
  
  return (
    <section className="container mx-auto px-4 py-5">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-full">
              <img src={logoSrc} alt={gameName} className="h-12 w-12 object-contain" />
            </div>
            <div>
              <h3 className="text-white text-2xl font-bold">{gameName}</h3>
              <div className="flex items-center text-white/80 text-sm">
                <Clock size={14} className="mr-1" />
                <span>{drawDate} • {timeRemaining}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-white text-xl md:text-3xl font-bold mb-2">
              {formattedJackpot}
            </div>
            <Link to={route}>
              <Button className="flex items-center bg-white text-purple-700 hover:bg-white/90">
                Jogar agora
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextDrawBanner;
