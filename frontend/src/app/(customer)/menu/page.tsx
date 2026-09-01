import { menu } from "@/lib/data/menu";
import { MenuClient } from "@/components/menu/menu-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Nutri Delight",
  description: "Browse our fresh and healthy menu. Order food and juices in Bhimavaram.",
};

export default function MenuPage() {
  // Deduplicate categories from real menu data safely
  const categories = Array.from(new Set(menu.map((item) => item.category)));

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FCFBF8]">
      <div className="bg-white border-b border-stone-200 px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">Our Menu</h1>
        <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto">
          Fresh ingredients, carefully prepared. Find your favorites and order today.
        </p>
      </div>
      <div className="flex-1">
        <MenuClient products={menu} categories={categories} />
      </div>
    </div>
  );
}
