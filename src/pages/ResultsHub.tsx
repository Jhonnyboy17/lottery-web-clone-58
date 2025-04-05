
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import ResultCard from "@/components/ResultCard";
import ResultsFilter from "@/components/ResultsFilter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { LotteryResult, LotteryResultRow, toLotteryResult } from "@/integrations/supabase/lottery-types";

const ResultsHub: React.FC = () => {
  const [gameType, setGameType] = useState("all");
  const [timeframe, setTimeframe] = useState("recent");
  const [resultsData, setResultsData] = useState<LotteryResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch results data from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      
      try {
        // Use raw query to avoid type errors with direct table access
        let query = supabase
          .from('lottery_results')
          .select('*')
          .order('draw_date', { ascending: false }) as any;
          
        // Filter by game type if not "all"
        if (gameType !== "all") {
          // Convert gameType to proper game_type format in the database
          const gameTypeMap: Record<string, string> = {
            "megasena": "Mega Millions",
            "quina": "Powerball",
            "lotofacil": "Lucky Day Lotto",
            "lotomania": "Lotto",
            "pick4": "Pick 4",
            "pick3": "Pick 3"
          };
          
          if (gameTypeMap[gameType]) {
            query = query.eq('game_type', gameTypeMap[gameType]);
          }
        }
        
        // Apply timeframe filter
        if (timeframe === "last-week") {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          query = query.gte('draw_date', lastWeek.toISOString());
        } else if (timeframe === "last-month") {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          query = query.gte('draw_date', lastMonth.toISOString());
        } else if (timeframe === "last-year") {
          const lastYear = new Date();
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          query = query.gte('draw_date', lastYear.toISOString());
        }
        
        const { data, error } = await query.limit(10);
        
        if (error) {
          console.error("Error fetching lottery results:", error);
          setIsLoading(false);
          return;
        }
        
        // Format data for display
        const formattedResults = (data as LotteryResultRow[]).map(result => {
          // Format the results to match the expected format for ResultCard
          const lotteryResult = toLotteryResult(result);
          
          return {
            id: lotteryResult.id,
            date: new Date(lotteryResult.draw_date).toLocaleDateString('pt-BR'),
            gameType: lotteryResult.game_type,
            numbers: lotteryResult.numbers,
            specialNumbers: lotteryResult.special_numbers || [],
            jackpotAmount: lotteryResult.jackpot_amount,
            // Prepare history data, for simplicity we're not fetching it now
            history: []
          };
        });
        
        setResultsData(formattedResults);
      } catch (err) {
        console.error("Error processing lottery results:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [gameType, timeframe]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="results-page flex-grow pb-16 pt-20 md:pt-28">
        <Container className="px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Resultados de Loterias</h1>
            <p className="text-xl text-gray-300 mb-10">
              Confira os resultados dos últimos sorteios das loterias
            </p>
            
            <ResultsFilter 
              gameType={gameType}
              onGameTypeChange={setGameType}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
            
            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-400">Carregando resultados...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {resultsData.map((result) => (
                  <ResultCard
                    key={result.id}
                    date={result.date}
                    gameType={result.gameType}
                    numbers={result.numbers}
                    history={result.history}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && resultsData.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-400">Nenhum resultado encontrado para os filtros selecionados.</p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-center gap-5 mt-12">
              <Button 
                className="bg-white text-purple-800 hover:bg-gray-100 font-medium text-lg py-3 px-6"
              >
                VERIFICAR SEUS NÚMEROS
              </Button>
              
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white border-0 font-medium text-lg py-3 px-6"
              >
                VER TODOS RESULTADOS
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
