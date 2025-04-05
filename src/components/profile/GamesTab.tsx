
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHistoryItem } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/formatUtils";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDown } from "lucide-react";

interface GamesTabProps {
  isLoading: boolean;
  orderHistory: OrderHistoryItem[];
}

const GamesTab: React.FC<GamesTabProps> = ({ isLoading, orderHistory }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleItemExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const activeGames = orderHistory.filter(game => !game.completed);
  const completedGames = orderHistory.filter(game => game.completed);
  
  const renderGameItem = (game: OrderHistoryItem) => {
    // Extract jackpot amount from game data if it exists
    const gameData = game.lines || [];
    const jackpotAmount = game.jackpotAmount || 
      (game.game_data && typeof game.game_data === 'object' && 'jackpotAmount' in game.game_data ? 
        game.game_data.jackpotAmount : null);
    
    return (
      <Card key={game.id} className="mb-4 overflow-hidden border-l-4" style={{ borderLeftColor: game.color || '#9333ea' }}>
        <CardHeader className="p-4 cursor-pointer" onClick={() => toggleItemExpanded(game.id)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={game.logoSrc} alt={game.gameName} className="h-10" />
              <div>
                <CardTitle className="text-lg">{game.gameName}</CardTitle>
                <CardDescription>
                  {game.purchaseDate ? new Date(game.purchaseDate).toLocaleDateString('pt-BR') : 'Data indisponível'} - {game.lineCount} {game.lineCount === 1 ? 'linha' : 'linhas'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="font-medium">{formatCurrency(game.price)}</div>
                {jackpotAmount && (
                  <div className="text-sm text-green-600">
                    Jackpot: {typeof jackpotAmount === 'number' ? 
                      jackpotAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
                      jackpotAmount}
                  </div>
                )}
              </div>
              <ChevronsUpDown size={16} className="text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        
        {expandedItems[game.id] && (
          <CardContent className="p-4 pt-0 border-t">
            {game.lines && game.lines.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-2">Seus números:</p>
                {game.lines.map((line, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="text-xs text-muted-foreground mb-1">Bilhete {idx + 1}:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {line.numbers.map((num, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-sm"
                        >
                          {num}
                        </span>
                      ))}
                      
                      {line.powerball && (
                        <>
                          <span className="inline-flex items-center justify-center h-7 px-1 rounded-full bg-gray-100 text-gray-500 font-medium text-sm">
                            +
                          </span>
                          <span 
                            className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-100 text-red-600 font-medium text-sm"
                          >
                            {line.powerball}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Detalhes do jogo não disponíveis</p>
            )}
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Número do pedido</p>
                  <p className="text-sm font-medium">{game.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data do sorteio</p>
                  <p className="text-sm font-medium">{game.drawDate || "Próximo sorteio"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="p-2 bg-muted/20 flex justify-end">
          <Button variant="ghost" size="sm">Verificar Resultado</Button>
        </CardFooter>
      </Card>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-lg">Carregando jogos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Meus Jogos</h2>
      
      <Tabs defaultValue="active">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="active">Jogos Ativos ({activeGames.length})</TabsTrigger>
          <TabsTrigger value="completed">Jogos Concluídos ({completedGames.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeGames.length > 0 ? (
            <div>
              {activeGames.map(renderGameItem)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-lg font-medium mb-4">Você ainda não possui jogos ativos</p>
                <Button>Comprar jogos</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedGames.length > 0 ? (
            <div>
              {completedGames.map(renderGameItem)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-lg text-muted-foreground">Nenhum jogo concluído encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamesTab;
