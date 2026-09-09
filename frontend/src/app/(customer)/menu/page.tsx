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
    <div className="w-full flex flex-col min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-16 sm:py-20 text-center sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <h1 className="relative text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">Our Menu</h1>
        <p className="relative mt-4 text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Fresh ingredients, carefully prepared. Find your favorites and order today.
        </p>
      </div>
      <div className="flex-1 w-full bg-background">
        <MenuClient products={menu} categories={categories} />
      </div>
    </div>
  );
}
