
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import ResultCard from "@/components/ResultCard";
import ResultsFilter from "@/components/ResultsFilter";

const ResultsHub: React.FC = () => {
  const [gameType, setGameType] = useState("all");
  const [timeframe, setTimeframe] = useState("recent");

  // Exemplo de dados de resultados
  const resultsData = [
    {
      id: 1,
      date: "15/05/2023",
      gameType: "Mega-Sena",
      numbers: [5, 12, 28, 34, 47, 58],
      jackpot: "R$ 45.000.000,00"
    },
    {
      id: 2,
      date: "14/05/2023",
      gameType: "Quina",
      numbers: [10, 25, 38, 42, 60],
      jackpot: "R$ 12.500.000,00"
    },
    {
      id: 3,
      date: "13/05/2023",
      gameType: "Lotofácil",
      numbers: [1, 2, 5, 8, 9, 10, 13, 14, 15, 17, 19, 20, 21, 22, 25],
      jackpot: "R$ 5.800.000,00"
    },
    {
      id: 4,
      date: "12/05/2023",
      gameType: "Lotomania",
      numbers: [3, 7, 11, 18, 22, 29, 34, 41, 50, 52, 59, 63, 67, 70, 75, 78, 83, 88, 94, 99],
      jackpot: "R$ 2.300.000,00"
    },
    {
      id: 5,
      date: "11/05/2023",
      gameType: "Mega-Sena",
      numbers: [7, 15, 22, 36, 48, 55],
      jackpot: "R$ 40.000.000,00"
    },
    {
      id: 6,
      date: "10/05/2023",
      gameType: "Quina",
      numbers: [8, 17, 30, 45, 52],
      jackpot: "R$ 10.800.000,00"
    }
  ];

  // Filtra os resultados com base no tipo de jogo selecionado
  const filteredResults = gameType === "all" 
    ? resultsData 
    : resultsData.filter(result => result.gameType.toLowerCase().replace("-", "") === gameType);

  return (
    <div className="results-page min-h-screen pb-12">
      <Container className="pt-8 px-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <ResultCard
                key={result.id}
                date={result.date}
                gameType={result.gameType}
                numbers={result.numbers}
                jackpot={result.jackpot}
              />
            ))}
          </div>
          
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum resultado encontrado para os filtros selecionados.</p>
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white border-0"
            >
              Carregar Mais Resultados
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResultsHub;
