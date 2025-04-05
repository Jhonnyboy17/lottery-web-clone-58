import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LotteryResultRow, toLotteryResult } from "@/integrations/supabase/lottery-types";

interface NumberGame {
  id: string;
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

const gameLogos: Record<string, string> = {
  "Mega Millions": "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
  "Powerball": "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
  "Lucky Day Lotto": "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
  "Lotto": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
  "Pick 4": "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
  "Pick 3": "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png"
};

const gameColors: Record<string, string> = {
  "Mega Millions": "bg-blue-500",
  "Powerball": "bg-red-500",
  "Lucky Day Lotto": "bg-green-500",
  "Lotto": "bg-blue-500",
  "Pick 4": "bg-blue-500",
  "Pick 3": "bg-amber-500"
};

const LotteryGameResult = ({ game }: { game: NumberGame }) => {
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
            <div className="font-bold text-gray-800">ÚLTIMOS RESULTADOS</div>
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
            Ver Resultados <ArrowRight className="ml-1 w-4 h-4" />
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
  const [games, setGames] = useState<NumberGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLotteryResults = async () => {
      setIsLoading(true);
      
      try {
        // Get the latest results for each game type
        const { data, error } = await supabase
          .from('lottery_results')
          .select('*')
          .order('draw_date', { ascending: false }) as any;
          
        if (error) {
          console.error("Error fetching lottery results:", error);
          setIsLoading(false);
          return;
        }
        
        // Group results by game_type and take the latest for each
        const latestByGameType = new Map();
        
        (data as LotteryResultRow[]).forEach(result => {
          if (!latestByGameType.has(result.game_type) || 
              new Date(result.draw_date) > new Date(latestByGameType.get(result.game_type).draw_date)) {
            latestByGameType.set(result.game_type, result);
          }
        });
        
        // Convert to our display format
        const gameResults: NumberGame[] = Array.from(latestByGameType.values()).map(result => {
          const lotteryResult = toLotteryResult(result);
          
          // Format draw date
          const drawDate = new Date(lotteryResult.draw_date);
          const formattedDate = drawDate.toLocaleDateString('pt-BR', {
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
          });
          
          // Create formatted numbers for display
          const formattedNumbers = [
            ...lotteryResult.numbers.map(n => ({
              value: n.toString(),
              color: gameColors[lotteryResult.game_type]
            })),
            ...(lotteryResult.special_numbers || []).map(n => ({
              value: n.toString(),
              isSpecial: true,
              color: "bg-amber-500"
            }))
          ];
          
          // Add multiplier if available
          if (lotteryResult.multiplier) {
            formattedNumbers.push({
              value: lotteryResult.multiplier,
              color: "bg-gray-200",
              multiplier: lotteryResult.multiplier
            });
          }
          
          return {
            id: lotteryResult.id,
            name: lotteryResult.game_type,
            logo: gameLogos[lotteryResult.game_type] || `https://via.placeholder.com/120x50/00A9E0/FFFFFF?text=${lotteryResult.game_type}`,
            date: formattedDate,
            drawTime: "",
            numbers: formattedNumbers
          };
        });
        
        setGames(gameResults);
      } catch (err) {
        console.error("Error processing lottery results:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLotteryResults();
  }, []);

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

      {isLoading ? (
        <div className="text-center py-10">
          <p>Carregando resultados...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <LotteryGameResult key={game.id} game={game} />
          ))}
        </div>
      )}
      
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
