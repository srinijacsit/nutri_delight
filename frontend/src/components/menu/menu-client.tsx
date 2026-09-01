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
      <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-4 sm:px-6 lg:px-8 space-y-4 shadow-sm">
        <div className="relative max-w-xl mx-auto w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-stone-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-stone-200 py-3 pl-11 pr-4 text-stone-900 placeholder:text-stone-400 focus:border-green-600 focus:ring-1 focus:ring-green-600 sm:text-sm bg-stone-50/50 transition-colors"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search menu"
          />
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto w-full">
          <ul 
            className="flex space-x-2 overflow-x-auto pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0"
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
                  className={`rounded-full px-5 py-2 text-sm font-bold whitespace-nowrap transition-colors focus:outline-none active:scale-95 ${
                    activeCategory === category
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900"
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4" aria-live="polite">
            <h3 className="mt-2 text-lg font-bold text-stone-900">No products found</h3>
            <p className="mt-1 text-sm text-stone-500">
              We couldn&apos;t find anything matching &quot;{searchQuery}&quot; in {activeCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 font-bold text-green-700 hover:text-green-800 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Sticky Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom,0)] bg-white border-t border-stone-200 shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.1)]">
          <div className="p-4 mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
              <span className="text-lg font-extrabold text-stone-900">
                ₹{totalPrice}
              </span>
            </div>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
