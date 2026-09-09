"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart, CartOption } from "@/contexts/cart-context";
import { getProductImage } from "@/lib/image-mapping";

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
  const imageSrc = getProductImage(product.id);

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/20 group">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image 
          src={imageSrc} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col flex-1 p-5 lg:p-6">
        <div className="space-y-3 mb-4 flex-1">
          <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-extrabold text-foreground/70 uppercase tracking-widest">
            {product.category}
          </span>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        {availableOptions && (
          <div className="mb-6">
            <label htmlFor={`options-${product.id}`} className="sr-only">Choose option</label>
            <select
              id={`options-${product.id}`}
              value={selectedOptionName}
              onChange={(e) => setSelectedOptionName(e.target.value)}
              className="block w-full rounded-xl border border-border bg-background py-2.5 pl-4 pr-10 text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              {availableOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name} {opt.price > 0 ? `(+₹${opt.price})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">₹{displayPrice}</span>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-4 bg-stone-100 rounded-full px-1.5 py-1.5 shadow-inner">
              <button
                onClick={() => decrementItem(cartItemId)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-all hover:bg-stone-50 active:scale-95"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <span className="text-xl leading-none mb-0.5 font-medium" aria-hidden="true">-</span>
              </button>
              <span className="text-sm font-bold text-foreground min-w-[2ch] text-center" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => incrementItem(cartItemId)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                aria-label={`Increase quantity of ${product.name}`}
              >
                <span className="text-xl leading-none mb-0.5 font-medium" aria-hidden="true">+</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart(product, selectedOption?.price || selectedOption?.name !== "Regular" && selectedOption?.name !== "None" ? selectedOption : (selectedOption ? { name: selectedOption.name, price: 0 } : undefined))}
              className="flex h-12 w-full max-w-30 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95 shrink-0"
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
