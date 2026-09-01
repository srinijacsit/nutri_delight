"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "INCREMENT_ITEM"; productId: string }
  | { type: "DECREMENT_ITEM"; productId: string }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE_CART"; items: CartItem[] };

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(i => i.product.id === action.product.id);
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "INCREMENT_ITEM": {
      return {
        ...state,
        items: state.items.map(item => 
          item.product.id === action.productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      };
    }
    case "DECREMENT_ITEM": {
      return {
        ...state,
        items: state.items.map(item => 
          item.product.id === action.productId 
            ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
            : item
        ).filter(item => item.quantity > 0)
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(i => i.product.id !== action.productId)
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "HYDRATE_CART":
      return { ...state, items: action.items, isHydrated: true };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isHydrated: false });

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nutridelight-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE_CART", items: parsed });
          return;
        }
      }
    } catch (e) {
      console.error("Failed to parse cart", e);
    }
    dispatch({ type: "HYDRATE_CART", items: [] });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (state.isHydrated) {
      localStorage.setItem("nutridelight-cart", JSON.stringify(state.items));
    }
  }, [state.items, state.isHydrated]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart: (product) => dispatch({ type: "ADD_ITEM", product }),
        incrementItem: (id) => dispatch({ type: "INCREMENT_ITEM", productId: id }),
        decrementItem: (id) => dispatch({ type: "DECREMENT_ITEM", productId: id }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", productId: id }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
