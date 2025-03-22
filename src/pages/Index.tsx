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
    logoSrc: "/lovable-uploads/b1358bc7-258b-46ca-a17a-592e52d47cc1.png",
    amount: "344,000,000",
    unit: "",
    cashOption: "161.5 MILLION",
    nextDrawing: "SEXTA, MAR 25, 9:59 PM",
    backgroundColor: "bg-blue-500",
    showPlayButton: true,
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
  },
  {
    id: 3,
    logoSrc: "/lovable-uploads/fdb7bf25-46c7-48d3-afb1-00c12bd21033.png",
    amount: "570,000",
    unit: "",
    cashOption: "320 THOUSAND",
    nextDrawing: "SEGUNDA, MAR 24, 9:59 PM",
    backgroundColor: "bg-green-500",
    showPlayButton: true,
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
  },
  {
    id: 6,
    logoSrc: "/lovable-uploads/9afb21d9-67e8-49f3-80f1-a35f5f1121be.png",
    amount: "500",
    unit: "",
    prefix: "WIN UP TO",
    nextDrawing: "TODOS OS DIAS 12:40 PM & 9:22 PM",
    backgroundColor: "bg-[#ffa039]",
    showPlayButton: true,
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

        <section id="lottery-games" className="container mx-auto px-4 py-12">
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
              />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 bg-gray-50">
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
