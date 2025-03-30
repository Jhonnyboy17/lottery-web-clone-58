
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface UseRapidApiOptions {
  host: string;
  endpoint: string;
}

export function useRapidApi<T = any>({ host, endpoint }: UseRapidApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching from RapidAPI ${host}${endpoint} with params:`, params);
      
      const { data: response, error: functionError } = await supabase.functions.invoke('rapidapi-proxy', {
        body: {
          host,
          endpoint,
          params
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      console.log("RapidAPI response:", response.data);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      console.error("Error fetching RapidAPI data:", err);
      const errorMessage = err.message || "Ocorreu um erro ao buscar dados da API";
      setError(errorMessage);
      toast({
        title: "Erro ao buscar dados",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    fetchData
  };
}
