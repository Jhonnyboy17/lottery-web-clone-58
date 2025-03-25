
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, CalendarDays, ArrowRight, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Game {
  id: number;
  name: string;
  logo: string;
  date: string;
  numbers: string[];
  specialNumbers?: string[];
  multiplier?: string;
}

interface MegaMillionsResult {
  drawDate: string;
  numbers: string[];
  megaBall: string;
  multiplier: string;
  jackpot?: string;
}

const gamesData: Game[] = [
  {
    id: 1,
    name: "Mega Millions",
    logo: "/lovable-uploads/bc3feaa6-86f8-46cb-b245-5467ab0e5fb4.png",
    date: "Sexta, Mar 21, 2024",
    numbers: ["15", "22", "31", "52", "57"],
    specialNumbers: ["12"],
    multiplier: "3X"
  },
  {
    id: 2,
    name: "Powerball",
    logo: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
    date: "Quarta, Mar 19, 2024",
    numbers: ["8", "11", "21", "49", "59"],
    specialNumbers: ["15"],
    multiplier: "2X"
  },
  {
    id: 3,
    name: "Lucky Day Lotto",
    logo: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
    date: "Segunda, Mar 24, 2024",
    numbers: ["3", "24", "27", "34", "38"]
  },
  {
    id: 4,
    name: "Pick 4",
    logo: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
    date: "Sábado, Mar 22, 2024",
    numbers: ["7", "0", "5", "3"],
    specialNumbers: ["7"]
  },
  {
    id: 5,
    name: "Cash 5",
    logo: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
    date: "Sábado, Mar 22, 2024",
    numbers: ["6", "12", "13", "20", "29"]
  },
  {
    id: 6,
    name: "Fast Play",
    logo: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png",
    date: "Todos os dias",
    numbers: ["02", "14", "26", "33", "40"]
  },
];

// Mega Millions historical data - based on Illinois Lottery website
const megaMillionsHistory: MegaMillionsResult[] = [
  {
    drawDate: "06/11/2024",
    numbers: ["11", "20", "29", "52", "66"],
    megaBall: "3",
    multiplier: "2X",
    jackpot: "R$ 350.000.000"
  },
  {
    drawDate: "06/07/2024",
    numbers: ["2", "16", "45", "54", "66"],
    megaBall: "15",
    multiplier: "4X",
    jackpot: "R$ 300.000.000"
  },
  {
    drawDate: "06/04/2024",
    numbers: ["5", "27", "29", "65", "73"],
    megaBall: "11",
    multiplier: "3X",
    jackpot: "R$ 280.000.000"
  },
  {
    drawDate: "05/31/2024",
    numbers: ["1", "13", "31", "36", "41"],
    megaBall: "25",
    multiplier: "2X",
    jackpot: "R$ 250.000.000"
  },
  {
    drawDate: "05/28/2024",
    numbers: ["13", "31", "33", "59", "62"],
    megaBall: "8",
    multiplier: "5X",
    jackpot: "R$ 220.000.000"
  },
  {
    drawDate: "05/24/2024",
    numbers: ["7", "18", "25", "45", "60"],
    megaBall: "16",
    multiplier: "3X",
    jackpot: "R$ 200.000.000"
  },
  {
    drawDate: "05/21/2024",
    numbers: ["12", "17", "26", "42", "65"],
    megaBall: "12",
    multiplier: "3X",
    jackpot: "R$ 190.000.000"
  },
  {
    drawDate: "05/17/2024",
    numbers: ["8", "22", "25", "29", "54"],
    megaBall: "19",
    multiplier: "2X",
    jackpot: "R$ 180.000.000"
  },
  {
    drawDate: "05/14/2024",
    numbers: ["13", "24", "36", "42", "66"],
    megaBall: "22",
    multiplier: "3X",
    jackpot: "R$ 170.000.000"
  },
  {
    drawDate: "05/10/2024",
    numbers: ["3", "8", "30", "35", "64"],
    megaBall: "12",
    multiplier: "2X",
    jackpot: "R$ 160.000.000"
  },
  {
    drawDate: "05/07/2024",
    numbers: ["11", "17", "33", "45", "66"],
    megaBall: "15",
    multiplier: "4X",
    jackpot: "R$ 150.000.000"
  },
  {
    drawDate: "05/03/2024",
    numbers: ["9", "14", "15", "36", "39"],
    megaBall: "2",
    multiplier: "3X",
    jackpot: "R$ 140.000.000"
  }
];

const ResultsHub = () => {
  const [activeTab, setActiveTab] = useState("all-games");
  const [currentPage, setCurrentPage] = useState(1);
  const [megaMillionsPage, setMegaMillionsPage] = useState(1);
  const gamesPerPage = 5;
  const megaMillionsResultsPerPage = 5;
  
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = gamesData.slice(indexOfFirstGame, indexOfLastGame);
  
  // Calculate pagination for Mega Millions results
  const indexOfLastMegaMillionsResult = megaMillionsPage * megaMillionsResultsPerPage;
  const indexOfFirstMegaMillionsResult = indexOfLastMegaMillionsResult - megaMillionsResultsPerPage;
  const currentMegaMillionsResults = megaMillionsHistory.slice(
    indexOfFirstMegaMillionsResult, 
    indexOfLastMegaMillionsResult
  );
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const paginateMegaMillions = (pageNumber: number) => setMegaMillionsPage(pageNumber);
  
  useEffect(() => {
    // Reset pagination when changing tabs
    if (activeTab === "mega-millions") {
      setMegaMillionsPage(1);
    } else if (activeTab === "all-games") {
      setCurrentPage(1);
    }
  }, [activeTab]);
  
  const getGameColor = (gameName: string) => {
    switch (gameName) {
      case "Mega Millions":
        return "bg-blue-500";
      case "Powerball":
        return "bg-[#ff5247]";
      case "Lucky Day Lotto":
        return "bg-[#8CD444]";
      case "Pick 4":
        return "bg-[#00ccc6]";
      case "Cash 5":
      case "Fast Play":
        return "bg-[#ffa039]";
      default:
        return "bg-blue-500";
    }
  };

  const formatDate = (dateStr: string) => {
    const [month, day, year] = dateStr.split('/');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthIndex = parseInt(month) - 1;
    const dayOfWeek = new Date(`${month}/${day}/${year}`).toLocaleDateString('pt-BR', { weekday: 'long' });
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    return `${capitalizedDay}, ${months[monthIndex]} ${day}, ${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-28">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="text-gray-500 flex items-center mr-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-lottery-navy">Results Hub</h1>
        </div>
        
        <Card className="mb-10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lottery-pink"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex items-center justify-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button className="bg-lottery-pink hover:bg-lottery-pink/90 text-white">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all-games" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-3/4 bg-gray-100 p-1">
            <TabsTrigger value="all-games" className="data-[state=active]:bg-white data-[state=active]:text-lottery-navy">
              All Games
            </TabsTrigger>
            <TabsTrigger value="mega-millions" className="data-[state=active]:bg-white data-[state=active]:text-lottery-navy">
              Mega Millions
            </TabsTrigger>
            <TabsTrigger value="powerball" className="data-[state=active]:bg-white data-[state=active]:text-lottery-navy">
              Powerball
            </TabsTrigger>
            <TabsTrigger value="lucky-day" className="data-[state=active]:bg-white data-[state=active]:text-lottery-navy">
              Lucky Day
            </TabsTrigger>
            <TabsTrigger value="pick4" className="data-[state=active]:bg-white data-[state=active]:text-lottery-navy">
              Pick 4
            </TabsTrigger>
            <TabsTrigger value="cash5" className="data-[state=active]:bg-white data-[state=active]:text-lottery-navy">
              Cash 5
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-games" className="mt-6">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-1/5 font-bold">Game</TableHead>
                    <TableHead className="w-1/5 font-bold">Draw Date</TableHead>
                    <TableHead className="w-2/5 font-bold">Numbers</TableHead>
                    <TableHead className="w-1/5 font-bold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGames.map((game) => (
                    <TableRow key={game.id} className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <img src={game.logo} alt={game.name} className="h-10 w-auto" />
                        </div>
                      </TableCell>
                      <TableCell>{game.date}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          {game.numbers.map((number, index) => (
                            <span 
                              key={index} 
                              className={`${getGameColor(game.name)} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                            >
                              {number}
                            </span>
                          ))}
                          
                          {game.specialNumbers?.map((number, index) => (
                            <span 
                              key={`special-${index}`} 
                              className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            >
                              {number}
                            </span>
                          ))}
                          
                          {game.multiplier && (
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs font-bold">
                              Multiplier: {game.multiplier}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" className="text-lottery-pink hover:text-lottery-pink/90">
                          View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) paginate(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(gamesData.length / gamesPerPage) }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === index + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(index + 1);
                      }}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < Math.ceil(gamesData.length / gamesPerPage)) {
                        paginate(currentPage + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
          
          <TabsContent value="mega-millions" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-lottery-navy">
                    Mega Millions Results
                  </h3>
                  <p className="text-gray-600">
                    Últimos 3 meses de resultados da Mega Millions
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <img 
                    src="/lovable-uploads/bc3feaa6-86f8-46cb-b245-5467ab0e5fb4.png" 
                    alt="Mega Millions Logo" 
                    className="h-12 w-auto mr-4"
                  />
                  <Button variant="outline" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-bold">Data do Sorteio</TableHead>
                      <TableHead className="font-bold">Números Sorteados</TableHead>
                      <TableHead className="font-bold">Mega Ball</TableHead>
                      <TableHead className="font-bold">Multiplicador</TableHead>
                      <TableHead className="font-bold">Valor da Premiação</TableHead>
                      <TableHead className="font-bold">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMegaMillionsResults.map((result, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{formatDate(result.drawDate)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            {result.numbers.map((number, idx) => (
                              <span 
                                key={idx} 
                                className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              >
                                {number}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {result.megaBall}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs font-bold">
                            {result.multiplier}
                          </span>
                        </TableCell>
                        <TableCell>{result.jackpot}</TableCell>
                        <TableCell>
                          <Button variant="ghost" className="text-lottery-pink hover:text-lottery-pink/90">
                            Ver Detalhes <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (megaMillionsPage > 1) paginateMegaMillions(megaMillionsPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(megaMillionsHistory.length / megaMillionsResultsPerPage) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        isActive={megaMillionsPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          paginateMegaMillions(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (megaMillionsPage < Math.ceil(megaMillionsHistory.length / megaMillionsResultsPerPage)) {
                          paginateMegaMillions(megaMillionsPage + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center mt-8 text-sm text-gray-500">
                <p>Fonte: <a href="https://www.illinoislottery.com/dbg/results/megamillions" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Illinois Lottery</a></p>
                <p className="mt-1">Atualizado regularmente com os resultados mais recentes</p>
              </div>
            </div>
            
            <Card className="bg-gray-50 border border-gray-200">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-lottery-navy mb-3">Como Jogar na Mega Millions</h4>
                <p className="text-gray-700 mb-4">
                  O sorteio da Mega Millions ocorre todas as terças e sextas-feiras. Para jogar:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Escolha 5 números de 1 a 70</li>
                  <li>Escolha 1 número Mega Ball de 1 a 25</li>
                  <li>Opcionalmente, adicione o Megaplier para multiplicar seus prêmios (exceto o jackpot)</li>
                  <li>Cada jogo custa R$ 15</li>
                </ol>
                <div className="mt-6">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Jogar Mega Millions Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {["powerball", "lucky-day", "pick4", "cash5"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-center text-lottery-navy mb-4">
                  {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Results
                </h3>
                <p className="text-center text-gray-500">
                  Showing filtered results for {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsHub;
