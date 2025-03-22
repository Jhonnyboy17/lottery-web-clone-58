
import { ArrowRight } from "lucide-react";

interface LotteryCardProps {
  logoSrc: string;
  amount: string;
  unit: string;
  cashOption: string;
  nextDrawing: string;
  backgroundColor?: string;
}

const LotteryCard = ({
  logoSrc,
  amount,
  unit,
  cashOption,
  nextDrawing,
  backgroundColor = "bg-white",
}: LotteryCardProps) => {
  return (
    <div className={`lottery-card ${backgroundColor} rounded-xl shadow-md overflow-hidden transition-all duration-300`}>
      <div className="p-6">
        <img
          src={logoSrc}
          alt="Lottery Game Logo"
          className="h-16 w-auto object-contain mx-auto mb-4"
        />
        <div className="text-center">
          <h2 className="text-5xl font-bold text-lottery-navy">
            ${amount}
          </h2>
          {unit && (
            <p className="text-2xl font-semibold text-lottery-navy uppercase tracking-wide mb-2">
              {unit}
            </p>
          )}
          <p className="text-sm text-gray-600 mb-1">
            Cash Option: ${cashOption}
          </p>
          <p className="text-xs text-gray-500 italic">Estimated Jackpot</p>
        </div>
      </div>
      <div className="bg-black/10 p-4 flex justify-between items-center">
        <p className="text-sm text-gray-700">Next Drawing: {nextDrawing}</p>
        <button className="text-lottery-pink hover:text-lottery-red transition-colors duration-300">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default LotteryCard;
