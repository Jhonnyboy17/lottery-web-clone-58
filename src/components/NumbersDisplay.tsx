
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NumbersGame {
  id: number;
  name: string;
  logo: string;
  date: string;
  numbers: {
    value: string;
    isSpecial?: boolean;
    multiplier?: string;
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
    date: "03/21/25",
    numbers: [
      { value: "15" },
      { value: "22" },
      { value: "31" },
      { value: "52" },
      { value: "57" },
      { value: "02", isSpecial: true },
    ],
  },
  {
    id: 2,
    name: "Cash Pop",
    logo: "https://via.placeholder.com/120x50/00A9E0/FFFFFF?text=CASH+POP",
    date: "Current",
    numbers: [{ value: "4" }],
    additionalInfo: [
      {
        label: "AS OF",
        value: ["03/21/2025 11 P.M."],
      },
      {
        label: "DRAW",
        value: ["#001280"],
      },
    ],
  },
  {
    id: 3,
    name: "Pick 3",
    logo: "https://via.placeholder.com/120x50/FF6B00/FFFFFF?text=PICK+3",
    date: "03/21/25",
    numbers: [
      { value: "9" },
      { value: "0" },
      { value: "8" },
    ],
    additionalInfo: [
      {
        label: "Midday",
        value: ["9", "0", "8"],
        time: "Midday",
      },
      {
        label: "Evening",
        value: ["5", "1", "5"],
        time: "Evening",
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
      <h2 className="text-2xl md:text-3xl font-bold text-lottery-pink text-center mb-8">
        Winning Numbers
      </h2>

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
              <img
                src={currentGame.logo}
                alt={`${currentGame.name} Logo`}
                className="h-10 object-contain mb-4 md:mb-0"
              />
              <span className="text-gray-600">{currentGame.date}</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {currentGame.numbers.map((number, index) => (
                <div
                  key={index}
                  className={`number-ball w-12 h-12 rounded-full ${
                    number.isSpecial
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  } flex items-center justify-center font-bold text-lg shadow-sm`}
                >
                  {number.value}
                  {number.multiplier && (
                    <span className="text-xs ml-1">{number.multiplier}</span>
                  )}
                </div>
              ))}
            </div>

            {currentGame.additionalInfo && (
              <div className="mt-6">
                {currentGame.additionalInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`${
                      info.time
                        ? "bg-opacity-20 p-3 rounded-lg mb-2"
                        : "text-center"
                    } ${
                      info.time === "Midday"
                        ? "bg-yellow-100"
                        : info.time === "Evening"
                        ? "bg-blue-100"
                        : ""
                    }`}
                  >
                    {info.time ? (
                      <div>
                        <p className="text-sm font-medium mb-2">{info.time}</p>
                        <div className="flex justify-center gap-2">
                          {info.value.map((val, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold shadow-sm"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{info.label}</span>{" "}
                        {info.value.join(" ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-lottery-pink hover:text-lottery-red text-sm font-medium transition-colors duration-300"
              >
                See past results
              </a>
            </div>
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
    </div>
  );
};

export default NumbersDisplay;
