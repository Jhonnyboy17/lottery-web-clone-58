import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NumbersGame {
  id: number;
  name: string;
  logo: string;
  date: string;
  drawTime?: string;
  numbers: {
    value: string;
    isSpecial?: boolean;
    multiplier?: string;
    color?: string;
  }[];
  additionalInfo?: {
    label: string;
    value: string[];
    time?: string;
  }[];
}

const games: NumbersGame[] = [
  {
    id: 1,
    name: "Mega Millions",
    logo: "https://via.placeholder.com/120x50/FFD100/000000?text=MEGA+MILLIONS",
    date: "Sexta-feira, 21 de março de 2025",
    numbers: [
      { value: "15", color: "bg-blue-500" },
      { value: "22", color: "bg-blue-500" },
      { value: "31", color: "bg-blue-500" },
      { value: "52", color: "bg-blue-500" },
      { value: "57", color: "bg-blue-500" },
      { value: "2", color: "bg-amber-500", isSpecial: true },
      { value: "x3", color: "bg-gray-200", multiplier: "x3" },
    ],
  },
  {
    id: 2,
    name: "Powerball",
    logo: "https://via.placeholder.com/120x50/FF5247/FFFFFF?text=POWERBALL",
    date: "Quarta-feira, 19 de março de 2025",
    numbers: [
      { value: "8", color: "bg-blue-500" },
      { value: "11", color: "bg-blue-500" },
      { value: "21", color: "bg-blue-500" },
      { value: "49", color: "bg-blue-500" },
      { value: "59", color: "bg-blue-500" },
      { value: "15", color: "bg-red-500", isSpecial: true },
      { value: "x2", color: "bg-gray-200", isSpecial: true },
    ],
  },
  {
    id: 3,
    name: "Pick 4",
    logo: "https://via.placeholder.com/120x50/00A9E0/FFFFFF?text=PICK+4",
    date: "Sexta-feira, 21 de março de 2025",
    drawTime: "Evening Draw",
    numbers: [
      { value: "7", color: "bg-blue-500" },
      { value: "0", color: "bg-blue-500" },
      { value: "5", color: "bg-blue-500" },
      { value: "3", color: "bg-blue-500" },
      { value: "7", color: "bg-red-500" },
    ],
  },
  {
    id: 4,
    name: "Lucky Day Lotto",
    logo: "https://via.placeholder.com/120x50/00CCC6/FFFFFF?text=LUCKY+DAY",
    date: "Sexta-feira, 21 de março de 2025",
    drawTime: "Evening Draw",
    numbers: [
      { value: "3", color: "bg-blue-500" },
      { value: "24", color: "bg-blue-500" },
      { value: "27", color: "bg-blue-500" },
      { value: "34", color: "bg-blue-500" },
      { value: "38", color: "bg-blue-500" },
    ],
  },
  {
    id: 5,
    name: "Lotto",
    logo: "https://via.placeholder.com/120x50/8CC63F/FFFFFF?text=LOTTO",
    date: "Quinta-feira, 20 de março de 2025",
    numbers: [
      { value: "6", color: "bg-blue-500" },
      { value: "12", color: "bg-green-500" },
      { value: "13", color: "bg-green-500" },
      { value: "20", color: "bg-green-500" },
      { value: "29", color: "bg-green-500" },
      { value: "31", color: "bg-green-500" },
      { value: "15", color: "bg-orange-500" },
    ],
    additionalInfo: [
      {
        label: "LOTTO MILLION 1",
        value: ["9", "14", "21", "25", "38", "43"],
      },
      {
        label: "LOTTO MILLION 2",
        value: ["2", "12", "14", "17", "39", "44"],
      },
    ],
  },
];

const LotteryGameResult = ({ game }: { game: NumbersGame }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={game.logo}
            alt={`${game.name} Logo`}
            className="h-10 object-contain"
          />
          <Separator orientation="vertical" className="h-10 hidden md:block" />
          <div className="flex flex-col justify-start items-start">
            <div className="font-bold text-gray-800">LATEST RESULTS</div>
            <div className="text-sm text-gray-600">{game.date}</div>
            {game.drawTime && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                {game.drawTime}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <Button
            variant="ghost"
            className="text-lottery-pink hover:text-lottery-red font-medium flex items-center"
          >
            View Results <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {game.numbers.map((number, index) => (
          <div
            key={index}
            className={`w-10 h-10 rounded-full ${
              number.color || (number.isSpecial ? "bg-red-500" : "bg-blue-500")
            } flex items-center justify-center font-bold text-white shadow-sm`}
          >
            {number.value}
            {number.multiplier && (
              <span className="text-xs ml-1">{number.multiplier}</span>
            )}
          </div>
        ))}
      </div>

      {game.additionalInfo && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {game.additionalInfo.map((info, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">{info.label}</p>
              <div className="flex flex-wrap gap-2">
                {info.value.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm shadow-sm"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NumbersDisplay = () => {
  const navigate = useNavigate();

  const navigateToResultsHub = () => {
    navigate('/results-hub');
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative">
      <h2 className="text-2xl md:text-3xl font-bold text-lottery-pink text-center mb-2">
        Você ganhou? Confira!
      </h2>
      <div className="text-center text-gray-600 mb-8">
        Confira aqui os resultados dos últimos sorteios das loterias dos EUA
      </div>

      <div className="space-y-4">
        {games.map((game) => (
          <LotteryGameResult key={game.id} game={game} />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={navigateToResultsHub}
          className="bg-white hover:bg-gray-100 text-lottery-navy border border-gray-300 rounded-full py-2 px-6 transition-colors duration-300"
        >
          VER TODOS OS RESULTADOS
        </Button>
      </div>
    </div>
  );
};

export default NumbersDisplay;
