"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/product-card";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";

interface MenuClientProps {
  products: Product[];
  categories: string[];
}

export function MenuClient({ products, categories }: MenuClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { totalItems, totalPrice } = useCart();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col pb-24">
      {/* Sticky Header with Search and Categories */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-6 sm:px-6 lg:px-8 space-y-6 shadow-sm">
        <div className="relative max-w-2xl mx-auto w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Search className="h-5 w-5 text-foreground/50" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border-2 border-border py-4 pl-14 pr-6 text-foreground font-medium placeholder:text-foreground/40 focus:border-primary focus:ring-0 sm:text-base bg-card/50 transition-colors shadow-inner outline-none"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search menu"
          />
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto w-full">
          <ul 
            className="flex space-x-3 overflow-x-auto pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none" }}
            role="tablist"
            aria-label="Menu categories"
          >
            {["All", ...categories].map((category) => (
              <li key={category} className="snap-start shrink-0" role="presentation">
                <button
                  onClick={() => setActiveCategory(category)}
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all focus:outline-none active:scale-95 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-card text-foreground/70 border border-border hover:bg-stone-100/50 hover:text-foreground hover:shadow-sm"
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
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

      {/* Sticky Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom,0)] bg-background border-t border-border shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)]">
          <div className="p-4 sm:p-5 mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </span>
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                ₹{totalPrice}
              </span>
            </div>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
