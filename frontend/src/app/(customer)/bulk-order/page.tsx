"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { menu } from "@/lib/data/menu";
import { BulkProductCard } from "@/components/ui/bulk-product-card";
import { useBulkCart } from "@/contexts/bulk-cart-context";

const CATEGORIES = ["All", ...Array.from(new Set(menu.map(item => item.category)))];

export default function BulkOrderPage() {
  const { totalItems, totalPrice, isHydrated } = useBulkCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menu.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header section specifically for bulk */}
      <div className="bg-stone-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/20 to-transparent opacity-50" />
        <h1 className="relative text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Corporate & Bulk Orders
        </h1>
        <p className="relative text-stone-300 max-w-2xl mx-auto text-lg sm:text-xl">
          Plan your event, party, or corporate lunch with Nutri Delight.
        </p>
      </div>

      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <Search className="h-5 w-5 text-foreground/50" aria-hidden="true" />
            </div>
            <input
              type="search"
              className="block w-full rounded-full border-2 border-border py-4 pl-14 pr-6 text-foreground font-medium placeholder:text-foreground/40 focus:border-primary focus:ring-0 sm:text-base bg-card/50 transition-colors shadow-inner outline-none"
              placeholder="Search for bulk items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`snap-start shrink-0 rounded-full px-6 py-2.5 text-sm font-bold transition-all focus:outline-none active:scale-95 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-card text-foreground/70 border border-border hover:bg-stone-100/50 hover:text-foreground hover:shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <BulkProductCard key={item.id} product={item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-32 px-4" aria-live="polite">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-6">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">No products found</h3>
            <p className="mt-3 text-base text-foreground/60 max-w-md mx-auto">
              We couldn&apos;t find anything matching &quot;{searchQuery}&quot; in {activeCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-8 font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-6 py-3 rounded-full"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {isHydrated && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-4 sm:px-6 lg:px-8 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-1">Bulk Cart Summary</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">
                {totalItems} items <span className="text-border mx-3">|</span> ₹{totalPrice}
              </p>
            </div>
            <Link
              href="/bulk-order/cart"
              className="flex w-full sm:w-auto items-center justify-center rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              View Bulk Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
