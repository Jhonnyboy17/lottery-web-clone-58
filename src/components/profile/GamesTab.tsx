
import React from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { OrderHistoryItem } from "@/contexts/CartContext";

interface GamesTabProps {
  isLoading: boolean;
  orderHistory: OrderHistoryItem[];
}

const GamesTab: React.FC<GamesTabProps> = ({ isLoading, orderHistory }) => {
  // Separar jogos futuros e passados
  const upcomingGames = orderHistory.filter(game => !game.completed);
  const pastGames = orderHistory.filter(game => game.completed);

  return (
    <div className="space-y-8">
      <div className="bg-[#1a0f36] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Meus Jogos</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-300">Carregando seus jogos...</p>
          </div>
        ) : (
          <>
            {upcomingGames.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Jogos Futuros
                </h2>
                <div className="space-y-4">
                  {upcomingGames.map((item, index) => (
                    <div key={item.id || index} className="bg-[#2a1b4e] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.color }}
                          >
                            <img 
                              src={item.logoSrc} 
                              alt={item.gameName} 
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{item.gameName}</h3>
                            <p className="text-gray-300 text-sm">
                              {item.lineCount} {item.lineCount > 1 ? 'linhas' : 'linha'} • 
                              Comprado em {new Date(item.purchaseDate).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-gray-400 text-xs">Pedido: {item.orderNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">
                            {typeof item.price === 'number' 
                              ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                              : `R$ ${item.price}`}
                          </p>
                          <p className="text-green-400 text-sm flex items-center justify-end">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Ativo
                          </p>
                        </div>
                      </div>
                      
                      {item.lines && item.lines.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-purple-900/30">
                          <p className="text-sm text-gray-300 mb-2">Números jogados:</p>
                          <div className="space-y-2">
                            {item.lines.map((line, lineIdx) => (
                              <div key={lineIdx} className="flex flex-wrap gap-1.5">
                                {line.numbers.map((num, numIdx) => (
                                  <span 
                                    key={numIdx} 
                                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-xs"
                                  >
                                    {num}
                                  </span>
                                ))}
                                
                                {line.powerball !== undefined && line.powerball !== null && (
                                  <>
                                    <span className="inline-flex items-center justify-center h-7 px-1 rounded-full bg-gray-100 text-gray-500 font-medium text-xs">
                                      +
                                    </span>
                                    <span 
                                      className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-100 text-red-600 font-medium text-xs"
                                    >
                                      {line.powerball}
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pastGames.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <XCircle className="mr-2 h-5 w-5" />
                  Jogos Encerrados
                </h2>
                <div className="space-y-4">
                  {pastGames.map((item, index) => (
                    <div key={item.id || index} className="bg-[#2a1b4e] rounded-lg p-4 opacity-70">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.color }}
                          >
                            <img 
                              src={item.logoSrc} 
                              alt={item.gameName} 
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{item.gameName}</h3>
                            <p className="text-gray-300 text-sm">
                              {item.lineCount} {item.lineCount > 1 ? 'linhas' : 'linha'} • 
                              Comprado em {new Date(item.purchaseDate).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-gray-400 text-xs">Pedido: {item.orderNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">
                            {typeof item.price === 'number' 
                              ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                              : `R$ ${item.price}`}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center justify-end">
                            <XCircle className="h-4 w-4 mr-1" />
                            Encerrado
                          </p>
                        </div>
                      </div>
                      
                      {item.lines && item.lines.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-purple-900/30">
                          <p className="text-sm text-gray-300 mb-2">Números jogados:</p>
                          <div className="space-y-2">
                            {item.lines.map((line, lineIdx) => (
                              <div key={lineIdx} className="flex flex-wrap gap-1.5">
                                {line.numbers.map((num, numIdx) => (
                                  <span 
                                    key={numIdx} 
                                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-medium text-xs"
                                  >
                                    {num}
                                  </span>
                                ))}
                                
                                {line.powerball !== undefined && line.powerball !== null && (
                                  <>
                                    <span className="inline-flex items-center justify-center h-7 px-1 rounded-full bg-gray-100 text-gray-500 font-medium text-xs">
                                      +
                                    </span>
                                    <span 
                                      className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-100 text-red-600 font-medium text-xs"
                                    >
                                      {line.powerball}
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {upcomingGames.length === 0 && pastGames.length === 0 && (
              <p className="text-gray-300 text-center py-8">Você ainda não possui jogos. Faça sua primeira aposta!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GamesTab;
