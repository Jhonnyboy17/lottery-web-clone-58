
import React, { createContext, useContext, useState, useEffect } from "react";

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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        setIsCartOpen
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
