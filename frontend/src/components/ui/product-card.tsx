"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart, CartOption } from "@/contexts/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, incrementItem, decrementItem } = useCart();
  
  // Define options logic based on business rules
  let availableOptions: CartOption[] | null = null;
  if (product.category === "Healthy Tiffins") {
    availableOptions = [
      { name: "Regular", price: 0 },
      { name: "Parcel", price: 10 }
    ];
  } else if (product.id === "chicken-roll") {
    availableOptions = [
      { name: "None", price: 0 },
      { name: "Omelette", price: 10 },
      { name: "Cheese", price: 20 }
    ];
  }

  const [selectedOptionName, setSelectedOptionName] = useState<string>(
    availableOptions ? availableOptions[0].name : ""
  );

  const selectedOption = availableOptions?.find(opt => opt.name === selectedOptionName);
  
  // Standardizing the ID generation for cart lookups:
  const cartItemId = `${product.id}${selectedOption ? `-${selectedOption.name}` : ""}`;

  const cartItem = items.find((i) => i.cartItemId === cartItemId);
  const quantity = cartItem?.quantity || 0;

  const displayPrice = product.price + (selectedOption?.price || 0);

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
      
      {availableOptions && (
        <div className="mt-4">
          <label htmlFor={`options-${product.id}`} className="sr-only">Choose option</label>
          <select
            id={`options-${product.id}`}
            value={selectedOptionName}
            onChange={(e) => setSelectedOptionName(e.target.value)}
            className="block w-full rounded-lg border-stone-200 bg-stone-50 py-2 pl-3 pr-8 text-sm text-stone-900 focus:border-green-600 focus:ring-green-600 outline-none"
          >
            {availableOptions.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.name} {opt.price > 0 ? `(+₹${opt.price})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-2">
        <span className="text-xl font-extrabold text-stone-900">₹{displayPrice}</span>
        
        {quantity > 0 ? (
          <div className="flex items-center gap-3 bg-stone-100 rounded-full px-1 py-1">
            <button
              onClick={() => decrementItem(cartItemId)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm transition-colors hover:bg-stone-50 active:scale-95"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <span className="text-xl leading-none mb-0.5" aria-hidden="true">-</span>
            </button>
            <span className="text-sm font-bold text-stone-900 min-w-[1ch] text-center" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={() => incrementItem(cartItemId)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm transition-colors hover:bg-stone-50 active:scale-95"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <span className="text-xl leading-none mb-0.5" aria-hidden="true">+</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(product, selectedOption?.price || selectedOption?.name !== "Regular" && selectedOption?.name !== "None" ? selectedOption : (selectedOption ? { name: selectedOption.name, price: 0 } : undefined))}
            className="flex h-9 items-center justify-center rounded-full bg-green-50 px-5 text-sm font-bold text-green-700 transition-colors hover:bg-green-100 hover:text-green-800 active:scale-95 shrink-0"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
