
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "./AuthContext";

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
  completed?: boolean;  // Adicionado para identificar jogos já realizados
};

export type WalletTransaction = {
  id: string;
  amount: number;
  date: string;
  type: 'deposit' | 'purchase';
  description: string;
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
  walletBalance: number;
  setWalletBalance: (amount: number) => void;
  addFundsToWallet: (amount: number) => void;
  deductFromWallet: (amount: number) => Promise<boolean>;
  walletTransactions: WalletTransaction[];
  fetchWalletData: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

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
    
    // Fetch order history and wallet data from Supabase if user is logged in
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchOrderHistory();
        fetchWalletData();
      }
    };
    
    fetchUserData();
  }, []);

  // Update wallet balance when profile changes
  useEffect(() => {
    if (profile && profile.wallet_balance !== undefined) {
      setWalletBalance(profile.wallet_balance);
    }
  }, [profile]);

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
        // Remover duplicações baseadas no orderNumber e gameData
        const uniqueItems = new Map();
        
        data.forEach(item => {
          const key = `${item.order_number}-${item.game_name}-${JSON.stringify(item.game_data)}`;
          if (!uniqueItems.has(key)) {
            uniqueItems.set(key, item);
          }
        });
        
        const formattedHistory: OrderHistoryItem[] = Array.from(uniqueItems.values()).map(item => {
          const gameData = item.game_data as { lines?: CartLineType[] } | null;
          const drawDate = item.draw_date || "Próximo sorteio";
          const drawDateObj = drawDate !== "Próximo sorteio" ? new Date(drawDate) : null;
          const isCompleted = drawDateObj ? drawDateObj < new Date() : false;
          
          return {
            id: item.id,
            gameName: item.game_name,
            logoSrc: item.logo_src || "",
            price: Number(item.price),
            lineCount: item.line_count,
            color: item.color || "",
            drawDate: drawDate,
            purchaseDate: item.purchase_date,
            orderNumber: item.order_number,
            lines: gameData?.lines || [],
            completed: isCompleted
          };
        });
        
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
      
      // Adicionar transação na carteira
      const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
      await addWalletTransaction(
        -totalPrice,
        'purchase',
        `Compra de ${items.length} jogos - ${orderNumber}`
      );
      
      // Refresh order history
      await fetchOrderHistory();
      
      return true;
    } catch (error) {
      console.error("Failed to add to order history:", error);
      toast.error("Erro ao finalizar a compra. Tente novamente.");
      return false;
    }
  };
  
  const addFundsToWallet = async (amount: number) => {
    if (amount <= 0) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("Você precisa estar logado para adicionar fundos");
        return;
      }
      
      const userId = session.user.id;
      const newBalance = walletBalance + amount;
      
      // Update profile wallet_balance
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating wallet balance:", profileError);
        toast.error("Erro ao atualizar saldo. Tente novamente.");
        return;
      }
      
      // Add transaction record
      await addWalletTransaction(amount, 'deposit', 'Adição de fundos');
      
      setWalletBalance(newBalance);
      toast.success(`R$ ${amount.toFixed(2)} adicionado à sua carteira!`);
    } catch (error) {
      console.error("Failed to add funds to wallet:", error);
      toast.error("Erro ao adicionar fundos. Tente novamente.");
    }
  };
  
  const deductFromWallet = async (amount: number): Promise<boolean> => {
    if (walletBalance < amount) {
      toast.error("Saldo insuficiente na carteira");
      return false;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("Você precisa estar logado para realizar compras");
        return false;
      }
      
      const userId = session.user.id;
      const newBalance = walletBalance - amount;
      
      // Update profile wallet_balance
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating wallet balance:", profileError);
        toast.error("Erro ao atualizar saldo. Tente novamente.");
        return false;
      }
      
      setWalletBalance(newBalance);
      return true;
    } catch (error) {
      console.error("Failed to deduct from wallet:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      return false;
    }
  };
  
  const addWalletTransaction = async (amount: number, type: 'deposit' | 'purchase', description: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("User not authenticated");
        return;
      }
      
      const transaction = {
        user_id: session.user.id,
        amount,
        description,
        transaction_type: type
      };
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert(transaction)
        .select();
        
      if (error) {
        console.error("Error adding wallet transaction:", error);
        return;
      }
      
      if (data && data.length > 0) {
        const newTransaction: WalletTransaction = {
          id: data[0].id,
          amount: Number(data[0].amount),
          date: data[0].date,
          type: data[0].transaction_type as 'deposit' | 'purchase',
          description: data[0].description
        };
        
        setWalletTransactions(prev => [newTransaction, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add wallet transaction:", error);
    }
  };
  
  const fetchWalletData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("User not authenticated");
        return;
      }
      
      // Fetch wallet transactions
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
        
      if (error) {
        console.error("Error fetching wallet transactions:", error);
        return;
      }
      
      if (data) {
        const formattedTransactions: WalletTransaction[] = data.map(item => ({
          id: item.id,
          amount: Number(item.amount),
          date: item.date,
          type: item.transaction_type as 'deposit' | 'purchase',
          description: item.description
        }));
        
        setWalletTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
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
        fetchOrderHistory,
        walletBalance,
        setWalletBalance,
        addFundsToWallet,
        deductFromWallet,
        walletTransactions,
        fetchWalletData
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
