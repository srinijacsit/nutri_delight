"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "@/lib/types";

export interface CartOption {
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  option?: CartOption;
  unitPrice: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; option?: CartOption }
  | { type: "INCREMENT_ITEM"; cartItemId: string }
  | { type: "DECREMENT_ITEM"; cartItemId: string }
  | { type: "REMOVE_ITEM"; cartItemId: string }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE_CART"; items: CartItem[] };

interface CartContextType extends CartState {
  addToCart: (product: Product, option?: CartOption) => void;
  incrementItem: (cartItemId: string) => void;
  decrementItem: (cartItemId: string) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const optionSuffix = action.option ? `-${action.option.name}` : "";
      const cartItemId = `${action.product.id}${optionSuffix}`;
      const unitPrice = action.product.price + (action.option?.price || 0);

      const existingItemIndex = state.items.findIndex(i => i.cartItemId === cartItemId);
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        return { ...state, items: newItems };
      }
      return { 
        ...state, 
        items: [...state.items, { cartItemId, product: action.product, quantity: 1, option: action.option, unitPrice }] 
      };
    }
    case "INCREMENT_ITEM": {
      return {
        ...state,
        items: state.items.map(item => 
          item.cartItemId === action.cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      };
    }
    case "DECREMENT_ITEM": {
      return {
        ...state,
        items: state.items.map(item => 
          item.cartItemId === action.cartItemId 
            ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
            : item
        ).filter(item => item.quantity > 0)
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(i => i.cartItemId !== action.cartItemId)
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "HYDRATE_CART":
      // Map old items to new structure if necessary
      const hydratedItems = action.items.map(item => {
        if (!item.cartItemId) {
          return {
            ...item,
            cartItemId: item.product.id,
            unitPrice: item.product.price,
          };
        }
        return item;
      });
      return { ...state, items: hydratedItems, isHydrated: true };
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
  const totalPrice = state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart: (product, option) => dispatch({ type: "ADD_ITEM", product, option }),
        incrementItem: (id) => dispatch({ type: "INCREMENT_ITEM", cartItemId: id }),
        decrementItem: (id) => dispatch({ type: "DECREMENT_ITEM", cartItemId: id }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", cartItemId: id }),
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
