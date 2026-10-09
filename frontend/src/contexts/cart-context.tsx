"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product, ProductOption } from "@/lib/types";
import { apiClient } from "@/lib/api/client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export interface CartItem {
  cartItemId: string; // Backend UUID of the cart item
  product: Product;
  quantity: number;
  option?: ProductOption;
  unitPrice: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, option?: ProductOption) => Promise<void>;
  incrementItem: (cartItemId: string) => Promise<void>;
  decrementItem: (cartItemId: string) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  const refreshCart = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setItems([]);
        setIsHydrated(true);
        return;
      }

      const cartData = await apiClient.get("/cart") as { items: Array<{ id: string; quantity: number; unitPrice: number; product: Product; option?: ProductOption | null }> };
      if (cartData && cartData.items) {
        const mappedItems: CartItem[] = cartData.items.map((item) => {
          return {
            cartItemId: item.id,
            product: item.product,
            quantity: item.quantity,
            option: item.option || undefined,
            unitPrice: item.unitPrice
          };
        });
        setItems(mappedItems);
      } else {
        setItems([]);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch cart", e);
      if (typeof e === 'object' && e !== null && 'status' in e && (e as {status?: number}).status === 401) {
        setItems([]);
      }
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (mounted) await refreshCart();
    }
    void load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        setTimeout(() => { void refreshCart(); }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshCart]);

  const handleUnauthorized = (e: unknown) => {
    if (typeof e === 'object' && e !== null && 'status' in e && (e as {status?: number}).status === 401) {
      router.push('/login');
    }
  };

  const addToCart = async (product: Product, option?: ProductOption) => {
    try {
      const realOption = product.options?.find(o => o.name === option?.name || o.name === `With ${option?.name}`);
      await apiClient.post("/cart/items", {
        product_id: product.id,
        option_id: realOption?.id || option?.id,
        quantity: 1
      });
      await refreshCart();
    } catch (e: unknown) {
      handleUnauthorized(e);
    }
  };

  const incrementItem = async (cartItemId: string) => {
    const item = items.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    try {
      await apiClient.patch(`/cart/items/${cartItemId}`, {
        quantity: item.quantity + 1
      });
      await refreshCart();
    } catch (e: unknown) {
      handleUnauthorized(e);
    }
  };

  const decrementItem = async (cartItemId: string) => {
    const item = items.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    if (item.quantity === 1) {
      return removeItem(cartItemId);
    }
    try {
      await apiClient.patch(`/cart/items/${cartItemId}`, {
        quantity: item.quantity - 1
      });
      await refreshCart();
    } catch (e: unknown) {
      handleUnauthorized(e);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await apiClient.delete(`/cart/items/${cartItemId}`);
      await refreshCart();
    } catch (e: unknown) {
      handleUnauthorized(e);
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete("/cart");
      await refreshCart();
    } catch (e: unknown) {
      handleUnauthorized(e);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        addToCart,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        refreshCart
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
