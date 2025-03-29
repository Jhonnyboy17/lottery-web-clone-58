
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

// Map game backgrounds to game names
const gameBackgrounds: Record<string, string> = {
  "Mega Millions": "bg-blue-500",
  "Powerball": "bg-[#ff5247]",
  "Lucky Day Lotto": "bg-[#8CD444]",
  "Pick 4": "bg-[#00ccc6]",
  "Cash 5": "bg-[#ffa039]",
  "Fast Play": "bg-[#ffa039]"
};

// Map game routes to game names
const gameRoutes: Record<string, string> = {
  "Mega Millions": "/play-mega-millions",
  "Powerball": "/play-powerball",
  "Lucky Day Lotto": "/play-lucky-day",
  "Pick 4": "/play-pick4",
  "Cash 5": "/play-cash5",
  "Fast Play": "/play-fast-play"
};

// Map prices to game names
const gamePrices: Record<string, number> = {
  "Mega Millions": 15,
  "Powerball": 15,
  "Lucky Day Lotto": 15,
  "Pick 4": 10,
  "Cash 5": 8,
  "Fast Play": 8
};

// Fetch lottery data from Supabase
const fetchLotteryDataFromSupabase = async (): Promise<LotteryGame[]> => {
  try {
    console.log("Fetching lottery data from Supabase...");
    
    const { data, error } = await supabase
      .from('lottery_data')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No data found in Supabase, using default data");
      return fetchDefaultLotteryData();
    }
    
    console.log("Supabase data:", data);
    
    // Map Supabase data to LotteryGame interface
    return data.map((game, index) => ({
      id: index + 1,
      logoSrc: game.logo_src || "",
      amount: game.jackpot_amount || "0",
      unit: "",
      prefix: game.game_name === "Cash 5" || game.game_name === "Fast Play" ? "WIN UP TO" : "",
      cashOption: game.cash_option || "",
      nextDrawing: game.next_drawing || "",
      backgroundColor: gameBackgrounds[game.game_name] || "bg-blue-500",
      showPlayButton: true,
      route: gameRoutes[game.game_name] || "/",
      price: gamePrices[game.game_name] || 10
    }));
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    return fetchDefaultLotteryData();
  }
};

// Trigger update of lottery data through edge function
const triggerLotteryDataUpdate = async () => {
  try {
    console.log("Triggering lottery data update via edge function...");
    
    const response = await supabase.functions.invoke('update-lottery-data');
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    console.log("Lottery data update triggered successfully:", response.data);
    return true;
  } catch (error) {
    console.error("Error triggering lottery data update:", error);
    return false;
  }
};

// Fallback function to provide default data if Supabase fetch fails
const fetchDefaultLotteryData = (): LotteryGame[] => {
  console.log("Using default lottery data");
  
  return [
    {
      id: 1,
      logoSrc: "/lovable-uploads/fde6b5b0-9d2f-4c41-915b-6c87c6deb823.png",
      amount: "380,000,000",
      unit: "",
      cashOption: "170.9 MILLION",
      nextDrawing: "QUARTA, ABR 24, 9:59 PM", 
      backgroundColor: "bg-blue-500",
      showPlayButton: true,
      route: "/play-mega-millions",
      price: 15,
    },
    {
      id: 2,
      logoSrc: "/lovable-uploads/96757871-5a04-478f-992a-0eca87ef37b8.png",
      amount: "102,000,000", 
      unit: "",
      cashOption: "48.6 MILLION",
      nextDrawing: "SÁBADO, ABR 27, 9:59 PM",
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
  const intervalRef = useRef<number | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // First, try to trigger an update of the data
      await triggerLotteryDataUpdate();
      
      // Then, fetch the updated data from Supabase
      const fetchedData = await fetchLotteryDataFromSupabase();
      setData(fetchedData);
      setLastUpdated(new Date());
      setError(null);
      console.log("Lottery data updated successfully:", new Date().toLocaleString());
    } catch (err) {
      setError("Falha ao atualizar os dados das loterias");
      console.error("Error updating lottery data:", err);
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
    // Fetch data immediately when component mounts
    fetchData();
    
    // Set up interval to fetch data every hour (3600000 ms)
    const intervalId = window.setInterval(() => {
      console.log("Running scheduled lottery data update");
      fetchData();
    }, 3600000);
    
    intervalRef.current = intervalId;
    
    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return { 
    data, 
    loading, 
    error, 
    lastUpdated,
    refreshData: fetchData // Exposed function to manually refresh data
  };
}
