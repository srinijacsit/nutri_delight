"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useBulkCart } from "@/contexts/bulk-cart-context";
import { CartOption } from "@/contexts/cart-context";
import { getProductImage } from "@/lib/image-mapping";

interface BulkProductCardProps {
  product: Product;
}

export function BulkProductCard({ product }: BulkProductCardProps) {
  const { items, addToCart, setQuantity } = useBulkCart();
  
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
  
  const [inputQuantity, setInputQuantity] = useState<string>("10"); // Default suggested bulk quantity

  const selectedOption = availableOptions?.find(opt => opt.name === selectedOptionName);
  
  const cartItemId = `${product.id}${selectedOption ? `-${selectedOption.name}` : ""}`;
  const cartItem = items.find((i) => i.cartItemId === cartItemId);
  const quantityInCart = cartItem?.quantity || 0;

  const displayPrice = product.price + (selectedOption?.price || 0);
  const imageSrc = getProductImage(product.id);

  const handleAdd = () => {
    const qty = parseInt(inputQuantity, 10);
    if (!isNaN(qty) && qty > 0) {
      if (quantityInCart > 0) {
        setQuantity(cartItemId, quantityInCart + qty);
      } else {
        addToCart(
          product, 
          qty, 
          selectedOption?.price || selectedOption?.name !== "Regular" && selectedOption?.name !== "None" ? selectedOption : (selectedOption ? { name: selectedOption.name, price: 0 } : undefined)
        );
      }
      setInputQuantity("10"); // reset
    }
  };

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
          <div className="mb-4">
            <label htmlFor={`bulk-options-${product.id}`} className="sr-only">Choose option</label>
            <select
              id={`bulk-options-${product.id}`}
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

        <div className="mt-auto">
          <span className="block text-2xl font-extrabold text-foreground mb-3 tracking-tight">₹{displayPrice}</span>
          
          <div className="flex items-center gap-3">
            <div className="relative w-24">
               <label htmlFor={`bulk-qty-${product.id}`} className="sr-only">Quantity</label>
               <input
                 type="number"
                 id={`bulk-qty-${product.id}`}
                 min="1"
                 value={inputQuantity}
                 onChange={(e) => setInputQuantity(e.target.value)}
                 className="block w-full rounded-xl border border-border bg-background py-3 px-4 text-sm font-bold text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none text-center"
                 placeholder="Qty"
               />
            </div>
            <button 
              onClick={handleAdd}
              className="flex flex-1 h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95 shrink-0"
              aria-label={`Add ${product.name} to bulk cart`}
            >
              Add to Bulk
            </button>
          </div>
          
          {quantityInCart > 0 && (
            <p className="mt-3 text-xs font-bold text-primary bg-primary/5 rounded-full px-3 py-1.5 inline-block">
              {quantityInCart} currently in bulk cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
