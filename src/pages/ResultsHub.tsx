
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

  // Example results data with history for last 4 draws
  const resultsData = [
    {
      id: 1,
      date: "15/05/2023",
      gameType: "Mega-Sena",
      numbers: [2, 9, 31, 60, 63, 23],
      history: [
        { date: "12/05/2023", numbers: [1, 5, 17, 39, 62, 8] },
        { date: "08/05/2023", numbers: [4, 13, 21, 26, 47, 58] },
        { date: "04/05/2023", numbers: [11, 18, 23, 37, 52, 57] }
      ]
    },
    {
      id: 2,
      date: "14/05/2023",
      gameType: "Quina",
      numbers: [10, 25, 38, 42, 60],
      history: [
        { date: "11/05/2023", numbers: [5, 18, 27, 36, 48] },
        { date: "07/05/2023", numbers: [2, 15, 22, 34, 45] },
        { date: "03/05/2023", numbers: [8, 19, 31, 44, 53] }
      ]
    },
    {
      id: 3,
      date: "13/05/2023",
      gameType: "Lotofácil",
      numbers: [1, 2, 5, 8, 9, 10],
      history: [
        { date: "10/05/2023", numbers: [3, 4, 6, 7, 11, 12] },
        { date: "06/05/2023", numbers: [6, 9, 13, 16, 19, 21] },
        { date: "02/05/2023", numbers: [2, 8, 11, 15, 18, 22] }
      ]
    },
    {
      id: 4,
      date: "12/05/2023",
      gameType: "Lotomania",
      numbers: [3, 7, 11, 18, 22, 29],
      history: [
        { date: "09/05/2023", numbers: [59, 63, 67, 70, 75, 78] },
        { date: "05/05/2023", numbers: [2, 12, 25, 36, 48, 55] },
        { date: "01/05/2023", numbers: [14, 27, 39, 51, 64, 72] }
      ]
    },
    {
      id: 5,
      date: "11/05/2023",
      gameType: "Pick 4",
      numbers: [7, 15, 22, 36],
      history: [
        { date: "08/05/2023", numbers: [4, 12, 19, 33] },
        { date: "04/05/2023", numbers: [2, 9, 16, 28] },
        { date: "30/04/2023", numbers: [5, 13, 24, 31] }
      ]
    },
    {
      id: 6,
      date: "10/05/2023",
      gameType: "Pick 3",
      numbers: [8, 17, 30],
      history: [
        { date: "07/05/2023", numbers: [6, 14, 27] },
        { date: "03/05/2023", numbers: [3, 12, 24] },
        { date: "29/04/2023", numbers: [5, 18, 29] }
      ]
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
                  gameType={result.gameType}
                  numbers={result.numbers}
                  history={result.history}
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
