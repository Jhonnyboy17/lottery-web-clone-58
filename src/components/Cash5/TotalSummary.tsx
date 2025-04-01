
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { SavedLineType } from "./types";
import { useAuth } from "@/contexts/AuthContext";

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
  const { addToCart, setIsCartOpen, walletBalance, deductFromWallet, addToOrderHistory } = useCart();
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
    
    // Verifica se tem saldo suficiente
    if (numericPrice > walletBalance) {
      toast.error("Saldo insuficiente na carteira. Adicione fundos para continuar.");
      return;
    }
    
    const gameId = location.pathname.split('/play-')[1];
    
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
      lines: cartLines
    };
    
    // Deduzir do saldo da carteira
    const deducted = await deductFromWallet(numericPrice);
    if (!deducted) {
      return;
    }
    
    // Adicionar ao carrinho
    addToCart(cartItem);
    
    // Adicionar diretamente ao histórico de compras
    const added = await addToOrderHistory([cartItem]);
    if (added) {
      toast.success(`${gameName} comprado com sucesso!`);
    } else {
      toast.error(`Erro ao processar compra. Tente novamente.`);
    }
    
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
          disabled={!hasLines || numericPrice > walletBalance}
          onClick={handleAddToCart}
        >
          COMPRAR AGORA
        </Button>
      </div>
    </div>
  );
};

export default TotalSummary;
