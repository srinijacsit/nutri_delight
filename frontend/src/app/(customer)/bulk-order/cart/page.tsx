"use client";

import Link from "next/link";
import { useBulkCart } from "@/contexts/bulk-cart-context";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function BulkCartPage() {
  const { items, setQuantity, incrementItem, decrementItem, removeItem, totalItems, totalPrice, isHydrated } = useBulkCart();

  if (!isHydrated) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-24">
        <div className="bg-card p-10 rounded-[2rem] border border-border shadow-xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight">Bulk Cart is empty</h1>
          <p className="relative text-base text-foreground/60 mb-10 leading-relaxed">Add items to proceed with your bulk order.</p>
          <Link
            href="/bulk-order"
            className="relative flex items-center justify-center w-full rounded-full bg-primary px-8 py-5 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Browse Bulk Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-10">Bulk Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {items.map((item) => (
              <div key={item.cartItemId} className="bg-card rounded-[1.5rem] p-5 sm:p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 sm:items-center justify-between group">
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 pr-4 group-hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                    <span className="text-xl font-extrabold text-foreground whitespace-nowrap tracking-tight">₹{item.unitPrice * item.quantity}</span>
                  </div>
                  {item.option && (
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-2">
                      + {item.option.name} (₹{item.option.price})
                    </span>
                  )}
                  <p className="text-sm font-medium text-foreground/50 mb-4 sm:mb-0">₹{item.unitPrice} each</p>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 mt-2 sm:mt-0">
                  <div className="flex items-center gap-4">
                    <label htmlFor={`cart-qty-${item.cartItemId}`} className="sr-only">Quantity</label>
                    <div className="flex items-center bg-stone-100 rounded-full px-1.5 py-1.5 shadow-inner">
                      <button
                        onClick={() => decrementItem(item.cartItemId)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-colors hover:bg-stone-50 active:scale-95 shrink-0"
                        aria-label={`Decrease quantity`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id={`cart-qty-${item.cartItemId}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                           const val = parseInt(e.target.value, 10);
                           if (!isNaN(val) && val > 0) {
                             setQuantity(item.cartItemId, val);
                           }
                        }}
                        className="w-16 bg-transparent text-center text-sm font-bold text-foreground focus:outline-none"
                      />
                      <button
                        onClick={() => incrementItem(item.cartItemId)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-95 shrink-0"
                        aria-label={`Increase quantity`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-3 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full transition-colors shrink-0 active:scale-95"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-10 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-xl sticky top-32 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-stone-50/50 to-transparent pointer-events-none" />
              <h2 className="relative text-2xl font-extrabold text-foreground mb-8 tracking-tight">Bulk Order Summary</h2>
              
              <dl className="relative space-y-5 text-base text-foreground/70 mb-8">
                <div className="flex justify-between pb-5 border-b border-border">
                  <dt className="font-medium">Items ({totalItems})</dt>
                  <dd className="font-bold text-foreground">₹{totalPrice}</dd>
                </div>
                <div className="flex justify-between pt-3">
                  <dt className="text-lg font-bold text-foreground">Subtotal</dt>
                  <dd className="text-2xl font-extrabold text-foreground tracking-tight">₹{totalPrice}</dd>
                </div>
              </dl>

              <Link
                href="/bulk-order/details"
                className="relative w-full flex items-center justify-center rounded-full bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 group"
              >
                Continue to Details
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
