
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

// Esta função simula a obtenção de dados de uma API externa
// Em um ambiente real, você substituiria isso por uma chamada de API real
const fetchLotteryData = async (): Promise<LotteryGame[]> => {
  // Simulando uma chamada de API com dados mais atualizados
  // Em produção, substitua por uma chamada real para um endpoint que faz web scraping
  
  // Simulando um pequeno atraso para imitar uma chamada de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 1,
      logoSrc: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
      amount: "356,000,000",  // Valor atualizado
      unit: "",
      cashOption: "167.8 MILLION",
      nextDrawing: "SEXTA, MAR 29, 9:59 PM", // Data atualizada
      backgroundColor: "bg-blue-500",
      showPlayButton: true,
      route: "/play-mega-millions",
      price: 15,
    },
    {
      id: 2,
      logoSrc: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
      amount: "460,000,000", // Valor atualizado
      unit: "",
      cashOption: "215.3 MILLION",
      nextDrawing: "SÁBADO, MAR 26, 9:59 PM", // Data atualizada
      backgroundColor: "bg-[#ff5247]",
      showPlayButton: true,
      route: "/play-powerball",
      price: 15,
    },
    {
      id: 3,
      logoSrc: "/lovable-uploads/92e3bb3d-af5b-4911-9c43-7c3685a6eac3.png",
      amount: "580,000", // Valor atualizado
      unit: "",
      cashOption: "325 THOUSAND",
      nextDrawing: "SEGUNDA, MAR 28, 9:59 PM", // Data atualizada
      backgroundColor: "bg-[#8CD444]",
      showPlayButton: true,
      route: "/play-lucky-day",
      price: 15,
    },
    {
      id: 4,
      logoSrc: "/lovable-uploads/005f7e6d-9f07-4838-a80c-4ce56aec2f58.png",
      amount: "105,000", // Valor atualizado
      unit: "",
      prefix: "",
      nextDrawing: "SÁBADO, MAR 26, 12:40 PM", // Data atualizada
      backgroundColor: "bg-[#00ccc6]",
      showPlayButton: true,
      route: "/play-pick4",
      price: 10,
    },
    {
      id: 5,
      logoSrc: "/lovable-uploads/c0b5f378-154f-476e-a51e-e9777bba8645.png",
      amount: "5,200", // Valor atualizado
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
      amount: "525", // Valor atualizado
      unit: "",
      prefix: "WIN UP TO",
      nextDrawing: "TODOS OS DIAS 12:40 PM & 9:22 PM",
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
    
    // Atualiza os dados a cada hora
    const interval = setInterval(fetchData, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { data, loading, error, lastUpdated, refreshData: fetchData };
}
