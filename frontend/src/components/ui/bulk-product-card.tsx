"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useBulkCart } from "@/contexts/bulk-cart-context";
import { CartOption } from "@/contexts/cart-context";

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
    <div className="flex flex-col justify-between rounded-[1.25rem] border border-stone-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group">
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-stone-900 group-hover:text-blue-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>
      
      {availableOptions && (
        <div className="mt-4">
          <label htmlFor={`bulk-options-${product.id}`} className="sr-only">Choose option</label>
          <select
            id={`bulk-options-${product.id}`}
            value={selectedOptionName}
            onChange={(e) => setSelectedOptionName(e.target.value)}
            className="block w-full rounded-lg border-stone-200 bg-stone-50 py-2 pl-3 pr-8 text-sm text-stone-900 focus:border-blue-600 focus:ring-blue-600 outline-none"
          >
            {availableOptions.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.name} {opt.price > 0 ? `(+₹${opt.price})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6">
        <span className="block text-xl font-extrabold text-stone-900 mb-2">₹{displayPrice}</span>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
             <label htmlFor={`bulk-qty-${product.id}`} className="sr-only">Quantity</label>
             <input
               type="number"
               id={`bulk-qty-${product.id}`}
               min="1"
               value={inputQuantity}
               onChange={(e) => setInputQuantity(e.target.value)}
               className="block w-full rounded-lg border border-stone-200 bg-white py-2 px-3 text-sm text-stone-900 focus:border-blue-600 focus:ring-blue-600 outline-none"
               placeholder="Qty"
             />
          </div>
          <button 
            onClick={handleAdd}
            className="flex h-[38px] items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 active:scale-95 shrink-0"
            aria-label={`Add ${product.name} to bulk cart`}
          >
            Add
          </button>
        </div>
        
        {quantityInCart > 0 && (
          <p className="mt-2 text-xs font-semibold text-blue-700">
            {quantityInCart} currently in bulk cart
          </p>
        )}
      </div>
    </div>
  );
}
