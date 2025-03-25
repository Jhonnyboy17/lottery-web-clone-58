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

const generateLast3MonthsDates = (): MegaMillionsResult[] => {
  const results: MegaMillionsResult[] = [];
  const currentDate = new Date();
  
  let drawDate = new Date(currentDate);
  
  const currentDay = drawDate.getDay();
  if (currentDay === 0) { // Sunday
    drawDate.setDate(drawDate.getDate() - 2); // Go to Friday
  } else if (currentDay === 1) { // Monday
    drawDate.setDate(drawDate.getDate() - 3); // Go to Friday
  } else if (currentDay === 2) { // Tuesday
    if (drawDate.getHours() < 22) {
      drawDate.setDate(drawDate.getDate() - 4);
    }
  } else if (currentDay === 3 || currentDay === 4) { // Wednesday or Thursday
    drawDate.setDate(drawDate.getDate() - (currentDay - 2)); // Go to Tuesday
  } else if (currentDay === 5) { // Friday
    if (drawDate.getHours() < 22) {
      drawDate.setDate(drawDate.getDate() - 3);
    }
  } else if (currentDay === 6) { // Saturday
    drawDate.setDate(drawDate.getDate() - 1); // Go to Friday
  }
  
  for (let i = 0; i < 24; i++) {
    const formattedDate = `${String(drawDate.getMonth() + 1).padStart(2, '0')}/${String(drawDate.getDate()).padStart(2, '0')}/${drawDate.getFullYear()}`;
    
    const jackpotAmount = 150 + (i * 10);
    
    results.push({
      drawDate: formattedDate,
      numbers: [
        String(Math.floor(Math.random() * 70) + 1),
        String(Math.floor(Math.random() * 70) + 1),
        String(Math.floor(Math.random() * 70) + 1),
        String(Math.floor(Math.random() * 70) + 1),
        String(Math.floor(Math.random() * 70) + 1)
      ],
      megaBall: String(Math.floor(Math.random() * 25) + 1),
      multiplier: `${Math.floor(Math.random() * 4) + 2}X`,
      jackpot: `R$ ${jackpotAmount}.000.000`
    });
    
    if (drawDate.getDay() === 5) {
      drawDate.setDate(drawDate.getDate() - 3);
    } 
    else if (drawDate.getDay() === 2) {
      drawDate.setDate(drawDate.getDate() - 4);
    }
  }
  
  return results;
};

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

const megaMillionsHistory: MegaMillionsResult[] = generateLast3MonthsDates();

const ResultsHub = () => {
  const [activeTab, setActiveTab] = useState("all-games");
  const [currentPage, setCurrentPage] = useState(1);
  const [megaMillionsPage, setMegaMillionsPage] = useState(1);
  const gamesPerPage = 5;
  const megaMillionsResultsPerPage = 5;
  
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = gamesData.slice(indexOfFirstGame, indexOfLastGame);
  
  const indexOfLastMegaMillionsResult = megaMillionsPage * megaMillionsResultsPerPage;
  const indexOfFirstMegaMillionsResult = indexOfLastMegaMillionsResult - megaMillionsResultsPerPage;
  const currentMegaMillionsResults = megaMillionsHistory.slice(
    indexOfFirstMegaMillionsResult, 
    indexOfLastMegaMillionsResult
  );
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const paginateMegaMillions = (pageNumber: number) => setMegaMillionsPage(pageNumber);
  
  useEffect(() => {
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
                <p className="mt-1">Atualizado em: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
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
