
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type CartLineType = {
  numbers: number[];
  powerball?: number | null;
  includeExtraPlay?: boolean;
  drawCount?: string;
};

export type CartItemType = {
  id: string;
  gameName: string;
  logoSrc: string;
  price: number;
  lineCount: number;
  color: string;
  drawDate?: string;
  lines?: CartLineType[];
  expanded?: boolean;
};

export type OrderHistoryItem = CartItemType & {
  purchaseDate: string;
  orderNumber: string;
};

type CartContextType = {
  cartItems: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  toggleItemExpanded: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orderHistory: OrderHistoryItem[];
  addToOrderHistory: (items: CartItemType[]) => Promise<boolean>;
  fetchOrderHistory: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    
    // Fetch order history from Supabase if user is logged in
    const fetchUserOrderHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchOrderHistory();
      }
    };
    
    fetchUserOrderHistory();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItemType) => {
    // Check if item already exists (by id)
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // If item exists, update it
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        lineCount: updatedItems[existingItemIndex].lineCount + item.lineCount,
        price: (updatedItems[existingItemIndex].price / updatedItems[existingItemIndex].lineCount) * 
               (updatedItems[existingItemIndex].lineCount + item.lineCount),
        lines: [...(updatedItems[existingItemIndex].lines || []), ...(item.lines || [])]
      };
      setCartItems(updatedItems);
    } else {
      // If item doesn't exist, add it
      setCartItems((prev) => [...prev, {...item, expanded: false}]);
    }
    
    // Open the cart drawer
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.lineCount, 0);
  };
  
  const toggleItemExpanded = (id: string) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, expanded: !item.expanded } 
          : item
      )
    );
  };

  const fetchOrderHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("User not authenticated");
        return;
      }
      
      const { data, error } = await supabase
        .from('game_purchases')
        .select('*')
        .eq('user_id', session.user.id)
        .order('purchase_date', { ascending: false });
        
      if (error) {
        console.error("Error fetching game history:", error);
        return;
      }
      
      if (data) {
        const formattedHistory: OrderHistoryItem[] = data.map(item => ({
          id: item.id,
          gameName: item.game_name,
          logoSrc: item.logo_src || "",
          price: Number(item.price),
          lineCount: item.line_count,
          color: item.color || "",
          drawDate: item.draw_date,
          purchaseDate: item.purchase_date,
          orderNumber: item.order_number,
          lines: item.game_data?.lines || []
        }));
        
        setOrderHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    }
  };

  const addToOrderHistory = async (items: CartItemType[]): Promise<boolean> => {
    if (items.length === 0) return false;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("Você precisa estar logado para finalizar a compra");
        return false;
      }
      
      const timestamp = new Date().toISOString();
      const orderNumber = `OD-${Date.now().toString().substring(7)}`;
      
      const purchases = items.map(item => ({
        user_id: session.user.id,
        order_number: orderNumber,
        game_name: item.gameName,
        price: item.price,
        line_count: item.lineCount,
        logo_src: item.logoSrc,
        color: item.color,
        draw_date: item.drawDate || "Próximo sorteio",
        purchase_date: timestamp,
        game_data: { lines: item.lines }
      }));
      
      const { error } = await supabase
        .from('game_purchases')
        .insert(purchases);
        
      if (error) {
        console.error("Error saving game purchases:", error);
        toast.error("Erro ao salvar os jogos. Tente novamente.");
        return false;
      }
      
      // Refresh order history
      await fetchOrderHistory();
      
      return true;
    } catch (error) {
      console.error("Failed to add to order history:", error);
      toast.error("Erro ao finalizar a compra. Tente novamente.");
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
        toggleItemExpanded,
        isCartOpen,
        setIsCartOpen,
        orderHistory,
        addToOrderHistory,
        fetchOrderHistory
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
