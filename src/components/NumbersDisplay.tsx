
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
    date: "Sexta, Mar 21",
    drawTime: "Evening Draw",
    numbers: [
      { value: "15", color: "bg-blue-500" },
      { value: "22", color: "bg-blue-500" },
      { value: "31", color: "bg-blue-500" },
      { value: "52", color: "bg-red-500" },
      { value: "57", color: "bg-blue-500" },
    ],
  },
  {
    id: 2,
    name: "Powerball",
    logo: "https://via.placeholder.com/120x50/FF5247/FFFFFF?text=POWERBALL",
    date: "Quarta, Mar 19",
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
    date: "Sexta, Mar 21",
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
    date: "Sexta, Mar 21",
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
    date: "Quinta, Mar 20",
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

const NumbersDisplay = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const handlePrevGame = () => {
    setCurrentGameIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const handleNextGame = () => {
    setCurrentGameIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
  };

  const currentGame = games[currentGameIndex];

  return (
    <div className="relative">
      <h2 className="text-2xl md:text-3xl font-bold text-lottery-pink text-center mb-2">
        Você ganhou? Confira!
      </h2>
      <div className="text-center text-gray-600 mb-8">
        Confira aqui os resultados dos últimos sorteios das loterias dos EUA
      </div>

      <div className="flex items-center">
        <button
          onClick={handlePrevGame}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          aria-label="Previous game"
        >
          <ChevronLeft className="w-6 h-6 text-lottery-pink" />
        </button>

        <div className="flex-1 mx-4">
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-2">
                <img
                  src={currentGame.logo}
                  alt={`${currentGame.name} Logo`}
                  className="h-10 object-contain"
                />
                <Separator orientation="vertical" className="h-10 hidden md:block" />
                <div className="flex flex-col justify-start items-start">
                  <div className="font-bold text-gray-800">LATEST RESULTS</div>
                  <div className="text-sm text-gray-600">{currentGame.date}</div>
                  {currentGame.drawTime && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                      {currentGame.drawTime}
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

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {currentGame.numbers.map((number, index) => (
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

            {currentGame.additionalInfo && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentGame.additionalInfo.map((info, index) => (
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
        </div>

        <button
          onClick={handleNextGame}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          aria-label="Next game"
        >
          <ChevronRight className="w-6 h-6 text-lottery-pink" />
        </button>
      </div>

      <div className="flex justify-center mt-4">
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
              index === currentGameIndex
                ? "bg-lottery-pink scale-125"
                : "bg-gray-300"
            }`}
            onClick={() => setCurrentGameIndex(index)}
            aria-label={`Go to game ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          className="bg-white hover:bg-gray-100 text-lottery-navy border border-gray-300 rounded-full py-2 px-6 transition-colors duration-300"
        >
          VIEW ALL RESULTS
        </Button>
      </div>
    </div>
  );
};

export default NumbersDisplay;
