
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LotteryCard from "@/components/LotteryCard";
import NumbersDisplay from "@/components/NumbersDisplay";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const lotteryGames = [
  {
    id: 1,
    logoSrc: "https://via.placeholder.com/160x80/FFD100/0000AA?text=MEGA+MILLIONS",
    amount: "344",
    unit: "MILLION",
    cashOption: "161.5 MILLION",
    nextDrawing: "03/25",
    backgroundColor: "bg-blue-500", // Blue background for Mega Millions
  },
  {
    id: 2,
    logoSrc: "/lovable-uploads/8dde0f4f-6cea-4cb1-b77a-880079fe58b5.png",
    amount: "444,000,000",
    unit: "",
    cashOption: "207.2 MILLION",
    nextDrawing: "SABADO, 22 MAR, 9:59PM",
    backgroundColor: "bg-red-500", // Red background for Powerball
  },
  {
    id: 3,
    logoSrc: "https://via.placeholder.com/160x80/FF9900/000000?text=MULTI-MATCH",
    amount: "570",
    unit: "THOUSAND",
    cashOption: "320 THOUSAND",
    nextDrawing: "03/24",
    backgroundColor: "bg-green-500", // Green background for Multi-Match
  },
];

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-6">
          <Hero />
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lotteryGames.map((game) => (
              <LotteryCard
                key={game.id}
                logoSrc={game.logoSrc}
                amount={game.amount}
                unit={game.unit}
                cashOption={game.cashOption}
                nextDrawing={game.nextDrawing}
                backgroundColor={game.backgroundColor}
              />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <NumbersDisplay />
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-lottery-navy mb-4">
              Where to Play
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
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

export default Index;
