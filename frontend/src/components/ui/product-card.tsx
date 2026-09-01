"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/contexts/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, incrementItem, decrementItem } = useCart();
  
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="flex flex-col justify-between rounded-[1.25rem] border border-stone-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-green-200 group">
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-stone-900 group-hover:text-green-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-extrabold text-stone-900">₹{product.price}</span>
        
        {quantity > 0 ? (
          <div className="flex items-center gap-3 bg-stone-100 rounded-full px-1 py-1">
            <button
              onClick={() => decrementItem(product.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm transition-colors hover:bg-stone-50 active:scale-95"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <span className="text-xl leading-none mb-0.5" aria-hidden="true">-</span>
            </button>
            <span className="text-sm font-bold text-stone-900 min-w-[1ch] text-center" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={() => incrementItem(product.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm transition-colors hover:bg-stone-50 active:scale-95"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <span className="text-xl leading-none mb-0.5" aria-hidden="true">+</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(product)}
            className="flex h-9 items-center justify-center rounded-full bg-green-50 px-5 text-sm font-bold text-green-700 transition-colors hover:bg-green-100 hover:text-green-800 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
