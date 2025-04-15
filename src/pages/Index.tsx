
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LotteryCard from "@/components/LotteryCard";
import NumbersDisplay from "@/components/NumbersDisplay";
import DrawTimes from "@/components/DrawTimes";
import Footer from "@/components/Footer";
import NextDrawBanner from "@/components/NextDrawBanner";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LotteryResultRow, toLotteryResult } from "@/integrations/supabase/lottery-types";

interface LotteryGame {
  id: number;
  logoSrc: string;
  amount: string;
  unit: string;
  prefix?: string;
  cashOption?: string;
  nextDrawing: string;
  backgroundColor: string;
  showPlayButton: boolean;
  route: string;
  price: number;
}

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [nextUpcomingGame, setNextUpcomingGame] = useState<{
    gameName: string;
    logoSrc: string;
    jackpotAmount: string;
    drawDate: string;
    timeRemaining: string;
    route: string;
  } | null>(null);
  const [lotteryGames, setLotteryGames] = useState<LotteryGame[]>([
    {
      id: 1,
      logoSrc: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
      amount: "344,000,000",
      unit: "",
      cashOption: "161.5 MILLION",
      nextDrawing: "SEXTA, MAR 25, 9:59 PM",
      backgroundColor: "bg-blue-500",
      showPlayButton: true,
      route: "/play-mega-millions",
      price: 15,
    },
    {
      id: 2,
      logoSrc: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
      amount: "444,000,000",
      unit: "",
      cashOption: "207.2 MILLION",
      nextDrawing: "SÁBADO, MAR 22, 9:59 PM",
      backgroundColor: "bg-[#ff5247]",
      showPlayButton: true,
      route: "/play-powerball",
      price: 15,
    },
    {
      id: 3,
      logoSrc: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
      amount: "570,000",
      unit: "",
      cashOption: "320 THOUSAND",
      nextDrawing: "SEGUNDA, MAR 24, 9:59 PM",
      backgroundColor: "bg-[#8CD444]",
      showPlayButton: true,
      route: "/play-lucky-day",
      price: 15,
    },
    {
      id: 4,
      logoSrc: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
      amount: "100,000",
      unit: "",
      prefix: "",
      nextDrawing: "SÁBADO, MAR 22, 12:40 PM",
      backgroundColor: "bg-[#00ccc6]",
      showPlayButton: true,
      route: "/play-pick4",
      price: 10,
    },
    {
      id: 5,
      logoSrc: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
      amount: "5,000",
      unit: "",
      prefix: "WIN UP TO",
      nextDrawing: "TODOS OS DIAS 12:40 PM & 9:22 PM",
      backgroundColor: "bg-[#ffa039]",
      showPlayButton: true,
      route: "/play-cash5",
      price: 8,
    },
    {
      id: 6,
      logoSrc: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png",
      amount: "500",
      unit: "",
      prefix: "WIN UP TO",
      nextDrawing: "TODOS OS DIAS 12:40 PM & 9:22 PM",
      backgroundColor: "bg-[#ffa039]",
      showPlayButton: true,
      route: "/play-fast-play",
      price: 8,
    },
  ]);

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

  useEffect(() => {
    if (window.location.hash === '#lottery-games') {
      const gamesSection = document.getElementById('lottery-games');
      if (gamesSection) {
        setTimeout(() => {
          gamesSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // New effect to determine the next upcoming game
  useEffect(() => {
    const findNextUpcomingGame = () => {
      const now = new Date();
      
      // Example format: "SEXTA, MAR 25, 9:59 PM"
      const getDateFromDrawingText = (text: string) => {
        try {
          const [dayOfWeek, monthDay, time] = text.split(', ');
          const [month, day] = monthDay.split(' ');
          const [hourMinute, period] = time.split(' ');
          const [hour, minute] = hourMinute.split(':');
          
          const monthMap: Record<string, number> = {
            JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5,
            JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11
          };
          
          const drawDate = new Date();
          drawDate.setMonth(monthMap[month]);
          drawDate.setDate(parseInt(day));
          
          let hourValue = parseInt(hour);
          if (period === 'PM' && hourValue < 12) hourValue += 12;
          if (period === 'AM' && hourValue === 12) hourValue = 0;
          
          drawDate.setHours(hourValue, parseInt(minute), 0);
          
          return drawDate;
        } catch (e) {
          console.error("Error parsing draw date:", e);
          return new Date(now.getTime() + 86400000); // Default to tomorrow
        }
      };
      
      // Calculate time remaining
      const getTimeRemaining = (drawDate: Date) => {
        const diff = drawDate.getTime() - now.getTime();
        
        if (diff < 0) return "Sorteio em andamento";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          return `${days}d ${hours}h restantes`;
        } else if (hours > 0) {
          return `${hours}h ${minutes}m restantes`;
        } else {
          return `${minutes} minutos restantes`;
        }
      };
      
      // Find the game with the nearest draw date
      let closestGame = null;
      let closestDate = null;
      let smallestDiff = Infinity;
      
      for (const game of lotteryGames) {
        // Skip games with special text like "TODOS OS DIAS"
        if (game.nextDrawing.includes("TODOS OS DIAS")) continue;
        
        const drawDate = getDateFromDrawingText(game.nextDrawing);
        const diff = drawDate.getTime() - now.getTime();
        
        // Only consider future draws
        if (diff > 0 && diff < smallestDiff) {
          smallestDiff = diff;
          closestGame = game;
          closestDate = drawDate;
        }
      }
      
      if (closestGame && closestDate) {
        setNextUpcomingGame({
          gameName: closestGame.id === 1 ? "Mega Millions" : 
                   closestGame.id === 2 ? "Powerball" :
                   closestGame.id === 3 ? "Lucky Day" :
                   closestGame.id === 4 ? "Pick 4" : 
                   closestGame.id === 5 ? "Cash 5" : "Fast Play",
          logoSrc: closestGame.logoSrc,
          jackpotAmount: closestGame.amount,
          drawDate: closestGame.nextDrawing.split(', ').slice(0, 2).join(', '),
          timeRemaining: getTimeRemaining(closestDate),
          route: closestGame.route
        });
      }
    };
    
    findNextUpcomingGame();
    // Re-calculate every minute
    const interval = setInterval(findNextUpcomingGame, 60000);
    
    return () => clearInterval(interval);
  }, [lotteryGames]);
  
  // New effect to fetch jackpot amounts
  useEffect(() => {
    const fetchJackpotAmounts = async () => {
      try {
        // Get latest lottery results to get current jackpot values
        const { data, error } = await supabase
          .from('lottery_results')
          .select('*')
          .order('draw_date', { ascending: false }) as any;
          
        if (error || !data) {
          console.error("Error fetching lottery results:", error);
          return;
        }
        
        // Create a map of game types to their latest results
        const latestByGameType = new Map();
        
        (data as LotteryResultRow[]).forEach(result => {
          if (!latestByGameType.has(result.game_type) || 
              new Date(result.draw_date) > new Date(latestByGameType.get(result.game_type).draw_date)) {
            latestByGameType.set(result.game_type, result);
          }
        });
        
        // Update lottery games with jackpot amounts
        const gameTypeMap: Record<number, string> = {
          1: "Mega Millions",
          2: "Powerball",
          3: "Lucky Day Lotto",
          4: "Lotto",
          5: "Pick 4",
          6: "Pick 3"
        };
        
        setLotteryGames(prevGames => 
          prevGames.map(game => {
            const gameType = gameTypeMap[game.id];
            const latestResult = latestByGameType.get(gameType);
            
            if (latestResult && latestResult.jackpot_amount) {
              // Format jackpot amount
              const formattedAmount = latestResult.jackpot_amount.toLocaleString('pt-BR');
              
              return {
                ...game,
                amount: formattedAmount
              };
            }
            
            return game;
          })
        );
      } catch (err) {
        console.error("Error processing jackpot amounts:", err);
      }
    };
    
    fetchJackpotAmounts();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-lottery-dark-bg transition-colors duration-300">
      <Navbar />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-6">
          <Hero />
        </section>

        {/* Next upcoming game banner */}
        {nextUpcomingGame && (
          <NextDrawBanner 
            gameName={nextUpcomingGame.gameName}
            logoSrc={nextUpcomingGame.logoSrc}
            jackpotAmount={nextUpcomingGame.jackpotAmount}
            drawDate={nextUpcomingGame.drawDate}
            timeRemaining={nextUpcomingGame.timeRemaining}
            route={nextUpcomingGame.route}
          />
        )}

        <section id="lottery-games" className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center text-lottery-navy dark:text-white mb-8">Loterias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lotteryGames.map((game) => (
              <LotteryCard
                key={game.id}
                logoSrc={game.logoSrc}
                amount={game.amount}
                unit={game.unit || ""}
                prefix={game.prefix || ""}
                cashOption={game.cashOption || ""}
                nextDrawing={game.nextDrawing}
                backgroundColor={game.backgroundColor}
                showPlayButton={game.showPlayButton}
                route={game.route}
              />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-lottery-dark-bg">
          <div className="bg-white dark:bg-lottery-dark-card rounded-xl shadow-md p-8">
            <NumbersDisplay />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <DrawTimes />
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

export default Index;
