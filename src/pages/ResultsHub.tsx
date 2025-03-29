
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import ResultCard from "@/components/ResultCard";
import ResultsFilter from "@/components/ResultsFilter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResultsHub: React.FC = () => {
  const [gameType, setGameType] = useState("all");
  const [timeframe, setTimeframe] = useState("recent");

  // Example results data with previous draw dates
  const resultsData = [
    {
      id: 1,
      date: "15/05/2023",
      previousDraw: "12/05/2023",
      gameType: "Mega-Sena",
      numbers: [5, 12, 28, 34, 47, 58]
    },
    {
      id: 2,
      date: "14/05/2023",
      previousDraw: "11/05/2023",
      gameType: "Quina",
      numbers: [10, 25, 38, 42, 60]
    },
    {
      id: 3,
      date: "13/05/2023",
      previousDraw: "10/05/2023",
      gameType: "Lotofácil",
      numbers: [1, 2, 5, 8, 9, 10, 13, 14, 15, 17, 19, 20, 21, 22, 25]
    },
    {
      id: 4,
      date: "12/05/2023",
      previousDraw: "09/05/2023",
      gameType: "Lotomania",
      numbers: [3, 7, 11, 18, 22, 29, 34, 41, 50, 52, 59, 63, 67, 70, 75, 78, 83, 88, 94, 99]
    },
    {
      id: 5,
      date: "11/05/2023",
      previousDraw: "08/05/2023",
      gameType: "Pick 4",
      numbers: [7, 15, 22, 36]
    },
    {
      id: 6,
      date: "10/05/2023",
      previousDraw: "07/05/2023",
      gameType: "Pick 3",
      numbers: [8, 17, 30]
    }
  ];

  // Filter results based on selected game type
  const filteredResults = gameType === "all" 
    ? resultsData 
    : resultsData.filter(result => result.gameType.toLowerCase().replace("-", "").replace("á", "a") === gameType);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="results-page flex-grow pb-12 pt-16 md:pt-24">
        <Container className="px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Resultados de Loterias</h1>
            <p className="text-gray-300 mb-8">
              Confira os resultados dos últimos sorteios das loterias
            </p>
            
            <ResultsFilter 
              gameType={gameType}
              onGameTypeChange={setGameType}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.id}
                  date={result.date}
                  previousDraw={result.previousDraw}
                  gameType={result.gameType}
                  numbers={result.numbers}
                />
              ))}
            </div>
            
            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Nenhum resultado encontrado para os filtros selecionados.</p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
              <Button 
                className="bg-white text-purple-800 hover:bg-gray-100 font-medium text-sm"
              >
                CHEQUE SEUS NÚMEROS
              </Button>
              
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white border-0 font-medium text-sm"
              >
                VER TODOS OS RESULTADOS
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default ResultsHub;
