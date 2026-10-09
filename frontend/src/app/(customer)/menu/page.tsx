import { MenuClient } from "@/components/menu/menu-client";
import { Metadata } from "next";
import { Product, Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Menu | Nutri Delight",
  description: "Browse our fresh and healthy menu. Order food and juices in Bhimavaram.",
};

export const revalidate = 0; // Prevent static rendering

export default async function MenuPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  let categoriesData: Category[] = [];
  let productsData: Product[] = [];

  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${apiUrl}/categories`, { cache: 'no-store' }),
      fetch(`${apiUrl}/products`, { cache: 'no-store' })
    ]);

    if (catRes.ok) {
      const json = await catRes.json();
      categoriesData = json.data || [];
    }
    if (prodRes.ok) {
      const json = await prodRes.json();
      productsData = json.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch catalog:", err);
  }

  // Deduplicate categories
  const categories = categoriesData.map((c) => c.name);

  // Map product options and category
  const mappedProducts = productsData.map((p) => {
    return {
      ...p,
      category: p.category || '',
    };
  });

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
        <MenuClient products={mappedProducts} categories={categories} />
      </div>
    </div>
  );
}
