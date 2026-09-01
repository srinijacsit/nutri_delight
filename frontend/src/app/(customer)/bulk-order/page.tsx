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
    <div className="min-h-screen bg-[#FCFBF8]">
      {/* Header section specifically for bulk */}
      <div className="bg-blue-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-4">
          Corporate & Bulk Orders
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          Plan your event, party, or corporate lunch with Nutri Delight.
        </p>
      </div>

      <div className="sticky top-[64px] z-30 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-stone-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              className="block w-full rounded-full border-0 bg-white py-3 pl-10 pr-4 text-stone-900 ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Search for bulk items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`snap-start shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all ${
                  activeCategory === category
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <BulkProductCard key={item.id} product={item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-stone-500 font-medium">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {isHydrated && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 p-4 sm:px-6 lg:px-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-0.5">Bulk Cart</p>
              <p className="text-xl font-extrabold text-stone-900">
                {totalItems} items <span className="text-stone-300 mx-2">|</span> ₹{totalPrice}
              </p>
            </div>
            <Link
              href="/bulk-order/cart"
              className="flex items-center justify-center rounded-full bg-blue-600 px-6 sm:px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Bulk Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
