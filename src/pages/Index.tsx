
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LotteryCard from "@/components/LotteryCard";
import NumbersDisplay from "@/components/NumbersDisplay";
import Footer from "@/components/Footer";
import { ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLotteryData } from "@/hooks/useLotteryData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { lotteryGames, loading, error, lastUpdated, refreshLotteryData } = useLotteryData();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation when page loads
  useEffect(() => {
    if (window.location.hash === '#lottery-games') {
      const gamesSection = document.getElementById('lottery-games');
      if (gamesSection) {
        // Small delay to ensure the page is fully loaded
        setTimeout(() => {
          gamesSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os valores atualizados das loterias. Tente novamente mais tarde.",
      });
    }
  }, [error, toast]);

  const handleRefreshData = async () => {
    try {
      toast({
        title: "Atualizando dados...",
        description: "Buscando os valores mais recentes das loterias.",
      });
      
      await refreshLotteryData();
      
      toast({
        title: "Dados atualizados!",
        description: "Os valores das loterias foram atualizados com sucesso.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: "Não foi possível atualizar os dados. Tente novamente mais tarde.",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "";
    
    try {
      const date = new Date(lastUpdated);
      return format(date, "'Atualizado em' dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Atualizado recentemente";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg transition-colors duration-300">
      <Navbar />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-6">
          <Hero />
        </section>

        <section id="lottery-games" className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-lottery-navy dark:text-white">Loterias</h2>
            
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatLastUpdated()}
                </p>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleRefreshData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
          
          {loading && lotteryGames.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="animate-spin h-8 w-8 text-lottery-pink" />
              <p className="ml-2 text-lg text-lottery-navy dark:text-white">Carregando dados das loterias...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lotteryGames.map((game) => (
                <LotteryCard
                  key={game.id}
                  logoSrc={game.logo_src}
                  amount={game.jackpot_amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  unit={""}
                  prefix={""}
                  cashOption={game.cash_option ? game.cash_option.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                  nextDrawing={game.next_drawing}
                  backgroundColor={getBackgroundColorByGameName(game.game_name)}
                  showPlayButton={true}
                  route={getRouteByGameName(game.game_name)}
                  exchangeRate={game.exchange_rate}
                />
              ))}
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-lottery-dark-bg">
          <div className="bg-white dark:bg-lottery-dark-card rounded-xl shadow-md p-8">
            <NumbersDisplay />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="bg-white dark:bg-lottery-dark-card rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-lottery-navy dark:text-white mb-4">
              Where to Play
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Find the nearest Maryland Lottery retailer or casino to play your favorite games.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="lottery-button bg-lottery-pink text-white hover:bg-lottery-pink/90 px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center">
                Find a Retailer <ChevronRight className="ml-1 w-4 h-4" />
              </button>
              <button className="lottery-button bg-lottery-navy text-white hover:bg-lottery-navy/90 px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center">
                Maryland Casinos <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 bg-lottery-pink text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-lottery-pink/90 z-50"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Função auxiliar para obter a cor de fundo com base no nome do jogo
const getBackgroundColorByGameName = (gameName: string) => {
  const colorMap: Record<string, string> = {
    'Mega Millions': 'bg-blue-500',
    'Powerball': 'bg-[#ff5247]',
    'Lucky Day Lotto': 'bg-[#8CD444]',
    'Pick 4': 'bg-[#00ccc6]',
    'Cash 5': 'bg-[#ffa039]',
    'Fast Play': 'bg-[#ffa039]',
  };
  
  return colorMap[gameName] || 'bg-blue-500';
};

// Função auxiliar para obter a rota com base no nome do jogo
const getRouteByGameName = (gameName: string) => {
  const routeMap: Record<string, string> = {
    'Mega Millions': '/play-mega-millions',
    'Powerball': '/play-powerball',
    'Lucky Day Lotto': '/play-lucky-day',
    'Pick 4': '/play-pick4',
    'Cash 5': '/play-cash5',
    'Fast Play': '/play-fast-play',
  };
  
  return routeMap[gameName] || '/';
};

export default Index;
