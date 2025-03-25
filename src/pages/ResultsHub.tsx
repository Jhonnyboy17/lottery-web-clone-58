import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Lottery data
const lotteries = [
  {
    id: "mega-millions",
    name: "Mega Millions",
    date: "2024-08-15",
    numbers: [10, 24, 47, 50, 65],
    megaBall: 12,
  },
  {
    id: "powerball",
    name: "Powerball",
    date: "2024-08-15",
    numbers: [5, 16, 22, 23, 29],
    powerBall: 6,
  },
  {
    id: "lucky-day",
    name: "Lucky Day Lotto",
    date: "2024-08-14",
    numbers: [3, 9, 12, 22, 33, 41],
  },
  {
    id: "pick-4",
    name: "Pick 4",
    date: "2024-08-15",
    numbers: [1, 2, 3, 4],
  },
  {
    id: "cash-5",
    name: "Cash 5",
    date: "2024-08-15",
    numbers: [2, 8, 15, 20, 35],
  },
  {
    id: "fast-play",
    name: "Fast Play",
    date: "2024-08-15",
    numbers: [11, 13, 17, 19, 23, 29, 31, 37, 41, 43],
  },
];

// Type definitions
type LotteryResult = {
  id: string;
  name: string;
  date: string;
  numbers: number[];
  megaBall?: number;
  powerBall?: number;
};

// Constants
const itemsPerPage = 3;

const ResultsHub = () => {
  const [selectedLottery, setSelectedLottery] = useState<string>("mega-millions");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredLotteries = lotteries.filter((lottery) => lottery.id === selectedLottery);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLotteries = filteredLotteries.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredLotteries.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Add console log to debug rendering
  useEffect(() => {
    console.log("ResultsHub component rendered");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Resultados de Loteria</h1>
        
        <Tabs defaultValue="mega-millions" className="w-full">
          <TabsList>
            <TabsTrigger value="mega-millions" onClick={() => setSelectedLottery("mega-millions")}>
              Mega Millions
            </TabsTrigger>
            <TabsTrigger value="powerball" onClick={() => setSelectedLottery("powerball")}>
              Powerball
            </TabsTrigger>
            <TabsTrigger value="lucky-day" onClick={() => setSelectedLottery("lucky-day")}>
              Lucky Day Lotto
            </TabsTrigger>
            <TabsTrigger value="pick-4" onClick={() => setSelectedLottery("pick-4")}>
              Pick 4
            </TabsTrigger>
            <TabsTrigger value="cash-5" onClick={() => setSelectedLottery("cash-5")}>
              Cash 5
            </TabsTrigger>
            <TabsTrigger value="fast-play" onClick={() => setSelectedLottery("fast-play")}>
              Fast Play
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mega-millions">
            {currentLotteries.map((lottery) => (
              <Card key={lottery.id} className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-semibold">{lottery.name}</h2>
                  <p>
                    <strong>Date:</strong> {lottery.date}
                  </p>
                  <p>
                    <strong>Numbers:</strong> {lottery.numbers.join(", ")}
                  </p>
                  <p>
                    <strong>Mega Ball:</strong> {lottery.megaBall}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="powerball">
            {currentLotteries.map((lottery) => (
              <Card key={lottery.id} className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-semibold">{lottery.name}</h2>
                  <p>
                    <strong>Date:</strong> {lottery.date}
                  </p>
                  <p>
                    <strong>Numbers:</strong> {lottery.numbers.join(", ")}
                  </p>
                  <p>
                    <strong>Power Ball:</strong> {lottery.powerBall}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="lucky-day">
            {currentLotteries.map((lottery) => (
              <Card key={lottery.id} className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-semibold">{lottery.name}</h2>
                  <p>
                    <strong>Date:</strong> {lottery.date}
                  </p>
                  <p>
                    <strong>Numbers:</strong> {lottery.numbers.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pick-4">
            {currentLotteries.map((lottery) => (
              <Card key={lottery.id} className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-semibold">{lottery.name}</h2>
                  <p>
                    <strong>Date:</strong> {lottery.date}
                  </p>
                  <p>
                    <strong>Numbers:</strong> {lottery.numbers.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cash-5">
            {currentLotteries.map((lottery) => (
              <Card key={lottery.id} className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-semibold">{lottery.name}</h2>
                  <p>
                    <strong>Date:</strong> {lottery.date}
                  </p>
                  <p>
                    <strong>Numbers:</strong> {lottery.numbers.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="fast-play">
            {currentLotteries.map((lottery) => (
              <Card key={lottery.id} className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-semibold">{lottery.name}</h2>
                  <p>
                    <strong>Date:</strong> {lottery.date}
                  </p>
                  <p>
                    <strong>Numbers:</strong> {lottery.numbers.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ResultsHub;
