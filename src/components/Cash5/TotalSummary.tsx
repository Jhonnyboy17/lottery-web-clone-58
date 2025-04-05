
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { SavedLineType } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TotalSummaryProps {
  ticketPrice: string;
  colorValue: string;
  hasLines: boolean;
  logoSrc?: string;
  gameName?: string;
  lineCount?: number;
  savedLines?: SavedLineType[];
  onClearLines?: () => void;
}

const TotalSummary: React.FC<TotalSummaryProps> = ({
  ticketPrice,
  colorValue,
  hasLines,
  logoSrc = "",
  gameName = "",
  lineCount = 0,
  savedLines = [],
  onClearLines
}) => {
  const { addToCart, setIsCartOpen, walletBalance } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Clean up the price format to avoid duplicate R$ symbols
  const formattedPrice = ticketPrice.startsWith("R$") ? 
    ticketPrice : `R$ ${ticketPrice}`;
  
  // Extract numeric price value
  const numericPrice = parseFloat(ticketPrice.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
  
  const handleAddToCart = async () => {
    if (!hasLines || lineCount === 0) {
      toast.error("Adicione pelo menos uma linha para continuar");
      return;
    }
    
    if (!user) {
      toast.error("Você precisa estar logado para continuar");
      navigate("/auth");
      return;
    }
    
    const gameId = location.pathname.split('/play-')[1];
    
    // Map game ID to the game_type in the database
    const gameTypeMap: Record<string, string> = {
      "mega-millions": "Mega Millions",
      "powerball": "Powerball",
      "lucky-day": "Lucky Day Lotto",
      "pick4": "Lotto",
      "cash5": "Pick 4",
      "fast-play": "Pick 3"
    };
    
    const gameType = gameTypeMap[gameId] || gameName;
    
    // Fetch current jackpot amount for this game
    let jackpotAmount = null;
    
    try {
      const { data, error } = await supabase
        .from('lottery_results')
        .select('jackpot_amount')
        .eq('game_type', gameType)
        .order('draw_date', { ascending: false })
        .limit(1) as any;
      
      if (data && data.length > 0) {
        jackpotAmount = data[0].jackpot_amount;
      }
    } catch (err) {
      console.error("Error fetching jackpot amount:", err);
    }
    
    // Convert saved lines to cart line type
    const cartLines = savedLines.map(line => ({
      numbers: line.numbers,
      powerball: line.powerball,
      includeExtraPlay: line.includeExtraPlay,
      drawCount: line.drawCount
    }));
    
    const cartItem = {
      id: `${gameId}-${Date.now()}`,
      gameName: gameName,
      logoSrc: logoSrc,
      price: numericPrice,
      lineCount: lineCount,
      color: colorValue,
      drawDate: "Próximo sorteio",
      lines: cartLines,
      jackpotAmount: jackpotAmount // Include jackpot amount in the cart item
    };
    
    // Add to cart and open cart drawer
    addToCart(cartItem);
    setIsCartOpen(true);
    toast.success(`${gameName} adicionado ao carrinho!`);
    
    // Clear lines after adding to cart
    if (onClearLines) {
      onClearLines();
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden w-full max-w-full">
      <div className="flex justify-between items-center p-3 border-t dark:border-purple-900/30">
        <div>
          <p className="text-sm font-medium">Total</p>
          <p className="text-xl font-bold">{formattedPrice}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Saldo na carteira: {walletBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <Button 
          className="hover:bg-opacity-90 px-12"
          style={{ backgroundColor: colorValue }}
          disabled={!hasLines}
          onClick={handleAddToCart}
        >
          COMPRAR AGORA
        </Button>
      </div>
    </div>
  );
};

export default TotalSummary;
