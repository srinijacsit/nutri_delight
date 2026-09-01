"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "@/lib/types";
import { CartOption } from "@/contexts/cart-context";

export interface BulkCartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  option?: CartOption;
  unitPrice: number;
}

interface BulkCartState {
  items: BulkCartItem[];
  isHydrated: boolean;
}

type BulkCartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number; option?: CartOption }
  | { type: "SET_QUANTITY"; cartItemId: string; quantity: number }
  | { type: "INCREMENT_ITEM"; cartItemId: string }
  | { type: "DECREMENT_ITEM"; cartItemId: string }
  | { type: "REMOVE_ITEM"; cartItemId: string }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE_CART"; items: BulkCartItem[] };

interface BulkCartContextType extends BulkCartState {
  addToCart: (product: Product, quantity: number, option?: CartOption) => void;
  setQuantity: (cartItemId: string, quantity: number) => void;
  incrementItem: (cartItemId: string) => void;
  decrementItem: (cartItemId: string) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const BulkCartContext = createContext<BulkCartContextType | undefined>(undefined);

function bulkCartReducer(state: BulkCartState, action: BulkCartAction): BulkCartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const optionSuffix = action.option ? `-${action.option.name}` : "";
      const cartItemId = `${action.product.id}${optionSuffix}`;
      const unitPrice = action.product.price + (action.option?.price || 0);

      const existingItemIndex = state.items.findIndex(i => i.cartItemId === cartItemId);
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.quantity;
        return { ...state, items: newItems };
      }
      return { 
        ...state, 
        items: [...state.items, { cartItemId, product: action.product, quantity: action.quantity, option: action.option, unitPrice }] 
      };
    }
    case "SET_QUANTITY": {
      return {
        ...state,
        items: state.items.map(item => 
          item.cartItemId === action.cartItemId 
            ? { ...item, quantity: Math.max(1, action.quantity) } 
            : item
        )
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
      return { ...state, items: action.items, isHydrated: true };
    default:
      return state;
  }
}

export function BulkCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bulkCartReducer, { items: [], isHydrated: false });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nutridelight-bulk-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE_CART", items: parsed });
          return;
        }
      }
    } catch (e) {
      console.error("Failed to parse bulk cart", e);
    }
    dispatch({ type: "HYDRATE_CART", items: [] });
  }, []);

  useEffect(() => {
    if (state.isHydrated) {
      localStorage.setItem("nutridelight-bulk-cart", JSON.stringify(state.items));
    }
  }, [state.items, state.isHydrated]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <BulkCartContext.Provider
      value={{
        ...state,
        addToCart: (product, quantity, option) => dispatch({ type: "ADD_ITEM", product, quantity, option }),
        setQuantity: (id, quantity) => dispatch({ type: "SET_QUANTITY", cartItemId: id, quantity }),
        incrementItem: (id) => dispatch({ type: "INCREMENT_ITEM", cartItemId: id }),
        decrementItem: (id) => dispatch({ type: "DECREMENT_ITEM", cartItemId: id }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", cartItemId: id }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </BulkCartContext.Provider>
  );
}

export function useBulkCart() {
  const context = useContext(BulkCartContext);
  if (context === undefined) {
    throw new Error("useBulkCart must be used within a BulkCartProvider");
  }
  return context;
}
