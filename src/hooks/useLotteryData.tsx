
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export interface LotteryGame {
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

// Esta função simula a obtenção de dados do site LotteryPost
// Em produção, você precisaria implementar um backend para fazer o web scraping
const fetchLotteryData = async (): Promise<LotteryGame[]> => {
  // Simulando uma chamada de API com dados baseados no site LotteryPost
  // Em produção, substitua por uma chamada real para um endpoint que faz web scraping
  
  // Simulando um pequeno atraso para imitar uma chamada de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 1,
      logoSrc: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
      amount: "29,000,000",  // Valor atualizado da Mega Millions conforme link https://www.lotterypost.com/results/il/megamillions
      unit: "",
      cashOption: "13.8 MILLION",
      nextDrawing: "TERÇA, ABR 09, 9:59 PM", 
      backgroundColor: "bg-blue-500",
      showPlayButton: true,
      route: "/play-mega-millions",
      price: 15,
    },
    {
      id: 2,
      logoSrc: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
      amount: "209,000,000", // Valor atualizado do Powerball conforme link https://www.lotterypost.com/results/il/powerball
      unit: "",
      cashOption: "99.6 MILLION",
      nextDrawing: "QUARTA, ABR 10, 9:59 PM", // Data atualizada do próximo sorteio Powerball
      backgroundColor: "bg-[#ff5247]",
      showPlayButton: true,
      route: "/play-powerball",
      price: 15,
    },
    {
      id: 3,
      logoSrc: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
      amount: "500,000", 
      unit: "",
      cashOption: "375 THOUSAND",
      nextDrawing: "SEGUNDA, ABR 08, 9:22 PM", 
      backgroundColor: "bg-[#8CD444]",
      showPlayButton: true,
      route: "/play-lucky-day",
      price: 15,
    },
    {
      id: 4,
      logoSrc: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
      amount: "10,000", 
      unit: "",
      prefix: "",
      nextDrawing: "DIARIAMENTE, 12:40 PM & 9:22 PM", 
      backgroundColor: "bg-[#00ccc6]",
      showPlayButton: true,
      route: "/play-pick4",
      price: 10,
    },
    {
      id: 5,
      logoSrc: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
      amount: "100,000", 
      unit: "",
      prefix: "WIN UP TO",
      nextDrawing: "DIARIAMENTE 12:40 PM & 9:22 PM",
      backgroundColor: "bg-[#ffa039]",
      showPlayButton: true,
      route: "/play-cash5",
      price: 8,
    },
    {
      id: 6,
      logoSrc: "/lovable-uploads/a02651ec-8efc-429a-8231-5ae52f5c4af5.png",
      amount: "50,000", 
      unit: "",
      prefix: "WIN UP TO",
      nextDrawing: "DIARIAMENTE 12:40 PM & 9:22 PM",
      backgroundColor: "bg-[#ffa039]",
      showPlayButton: true,
      route: "/play-fast-play",
      price: 8,
    },
  ];
};

export function useLotteryData() {
  const [data, setData] = useState<LotteryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchLotteryData();
      setData(fetchedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Falha ao atualizar os dados das loterias");
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível obter os dados atualizados das loterias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    
    // Não vamos usar mais o intervalo, pois os dados serão atualizados apenas quando a página for carregada
    // Porém, se quiser manter uma atualização periódica em segundo plano, pode manter o código abaixo
    // const interval = setInterval(fetchData, 60 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []);
  
  return { data, loading, error, lastUpdated, refreshData: fetchData };
}
