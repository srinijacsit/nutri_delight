"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, incrementItem, decrementItem, removeItem, totalItems, totalPrice, isHydrated } = useCart();

  // Handle hydration mismatch by showing a loading state or nothing until hydrated
  if (!isHydrated) {
    return <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Your cart is empty</h1>
          <p className="text-stone-500 mb-8">Looks like you haven&apos;t added any delicious items yet.</p>
          <Link
            href="/menu"
            className="flex items-center justify-center w-full rounded-full bg-green-600 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-8">Your Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.cartItemId} className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-stone-900 line-clamp-2 pr-4">
                      {item.product.name}
                    </h3>
                    <span className="text-lg font-extrabold text-stone-900 whitespace-nowrap">₹{item.unitPrice * item.quantity}</span>
                  </div>
                  {item.option && (
                    <p className="text-sm font-semibold text-green-700 mb-1">+ {item.option.name} (₹{item.option.price})</p>
                  )}
                  <p className="text-sm font-medium text-stone-500 mb-4 sm:mb-0">₹{item.unitPrice} each</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center gap-3 bg-stone-100 rounded-full px-1 py-1 shrink-0">
                    <button
                      onClick={() => decrementItem(item.cartItemId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm transition-colors hover:bg-stone-50 active:scale-95"
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-stone-900 min-w-[2ch] text-center" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementItem(item.cartItemId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm transition-colors hover:bg-stone-50 active:scale-95"
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors shrink-0"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
              
              <dl className="space-y-4 text-sm text-stone-600 mb-6">
                <div className="flex justify-between pb-4 border-b border-stone-100">
                  <dt>Items ({totalItems})</dt>
                  <dd className="font-medium text-stone-900">₹{totalPrice}</dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="text-base font-bold text-stone-900">Subtotal</dt>
                  <dd className="text-lg font-extrabold text-stone-900">₹{totalPrice}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center rounded-full bg-green-600 px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95 group"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
