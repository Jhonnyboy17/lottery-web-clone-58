
import React from "react";
import { X, ShoppingCart, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { 
    cartItems, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    getItemCount, 
    toggleItemExpanded,
    isCartOpen,
    setIsCartOpen
  } = useCart();
  
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };
  
  const hasItems = cartItems.length > 0;

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingCart className="h-6 w-6 text-white cursor-pointer" />
          {hasItems && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getItemCount()}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-[90vw]">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Meu Carrinho
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-[calc(100vh-10rem)]">
          {hasItems ? (
            <>
              <div className="flex-1 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="mb-4 bg-white rounded-lg shadow p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: item.color }}
                        >
                          <img 
                            src={item.logoSrc} 
                            alt={item.gameName} 
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.gameName}</h3>
                          <p className="text-sm text-gray-500">{item.lineCount} {item.lineCount > 1 ? 'linhas' : 'linha'}</p>
                          {item.drawDate && (
                            <p className="text-xs text-gray-400">Sorteio: {item.drawDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold">
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 mt-1 flex items-center text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
                        </button>
                      </div>
                    </div>
                    
                    {item.lines && item.lines.length > 0 && (
                      <div className="mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleItemExpanded(item.id)}
                          className="w-full flex justify-between items-center text-sm p-1 h-8"
                        >
                          <span>Ver números</span>
                          {item.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                        
                        {item.expanded && (
                          <div className="mt-2 bg-gray-50 p-2 rounded">
                            {item.lines.map((line, lineIndex) => (
                              <div key={lineIndex} className="flex items-center mb-1 py-1 border-b border-gray-100 last:border-0">
                                <span className="text-gray-500 font-medium text-xs mr-2">
                                  {String(lineIndex + 1).padStart(2, '0')}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {line.numbers.map((num, numIndex) => (
                                    <span 
                                      key={numIndex} 
                                      className="text-white text-xs rounded-full w-6 h-6 flex items-center justify-center" 
                                      style={{ backgroundColor: item.color }}
                                    >
                                      {num}
                                    </span>
                                  ))}
                                  {line.powerball !== null && line.powerball !== undefined && (
                                    <span 
                                      className="bg-amber-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                      {line.powerball}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto pt-4">
                <Separator className="mb-4" />
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-lg">
                    {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button onClick={handleCheckout} className="w-full">
                    Finalizar Compra
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center mb-4">Seu carrinho está vazio</p>
              <Button asChild variant="outline">
                <a href="/#lottery-games">Continuar Comprando</a>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
