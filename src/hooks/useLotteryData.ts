
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LotteryGame {
  id: string;
  game_name: string;
  jackpot_amount: string;
  cash_option: string | null;
  next_drawing: string;
  logo_src: string;
  exchange_rate: number;
  last_updated: string;
}

export const useLotteryData = () => {
  const [lotteryGames, setLotteryGames] = useState<LotteryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotteryData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('lottery_data')
          .select('*')
          .order('game_name');

        if (error) {
          throw error;
        }

        if (data) {
          setLotteryGames(data as LotteryGame[]);
          
          // Se temos dados, definimos a data da última atualização
          if (data.length > 0) {
            setLastUpdated(data[0].last_updated);
          }
        }
      } catch (err) {
        console.error('Error fetching lottery data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch lottery data'));
      } finally {
        setLoading(false);
      }
    };

    fetchLotteryData();
    
    // Configurar subscription para receber atualizações em tempo real
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lottery_data'
        }, 
        (payload) => {
          console.log('Lottery data updated:', payload);
          // Atualizar os dados quando houver mudanças
          fetchLotteryData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Função para invocar manualmente a atualização via Edge Function
  const refreshLotteryData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('update-lottery-data');
      
      if (error) {
        throw error;
      }
      
      console.log('Lottery data refresh response:', data);
      
      // Recarregar os dados após a atualização
      const { data: updatedData, error: fetchError } = await supabase
        .from('lottery_data')
        .select('*')
        .order('game_name');
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (updatedData) {
        setLotteryGames(updatedData as LotteryGame[]);
        if (updatedData.length > 0) {
          setLastUpdated(updatedData[0].last_updated);
        }
      }
    } catch (err) {
      console.error('Error refreshing lottery data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh lottery data'));
    } finally {
      setLoading(false);
    }
  };

  return {
    lotteryGames,
    loading,
    error,
    lastUpdated,
    refreshLotteryData
  };
};
