import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { menu } from "@/lib/data/menu";
import { ProductCard } from "@/components/ui/product-card";

// 1. Derive categories dynamically from the menu source of truth
const categories = Array.from(new Set(menu.map((item) => item.category)));

// 2. Curate real products dynamically (deterministic selection without duplicating data)
const curatedProducts = [
  menu.find((p) => p.id === "watermelon"),
  menu.find((p) => p.id === "chicken-roll"),
  menu.find((p) => p.id === "pani-puri-6"),
  menu.find((p) => p.id === "multi-millet-dosa"),
].filter(Boolean) as typeof menu;

export default function CustomerHome() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-green-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-4xl text-center">
          <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
            Making Bhimavaram Healthy
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-green-800">
            Discover a curated menu of fresh juices, healthy tiffins, and delicious snacks. Order now and enjoy premium quality food.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/menu"
              className="group inline-flex items-center justify-center rounded-full bg-green-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 active:scale-95"
            >
              Explore Menu
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Category Discovery */}
      <section className="border-t border-green-100 bg-white py-12 sm:py-16" aria-labelledby="category-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="category-heading" className="text-2xl font-bold tracking-tight text-green-950">
            Browse by Category
          </h2>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="mt-6 -mx-4 flex overflow-x-auto px-4 pb-4 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 sm:gap-4 sm:px-0 sm:overflow-visible sm:pb-0" style={{ scrollbarWidth: "none" }}>
            {categories.map((category) => (
              <div 
                key={category} 
                className="mr-4 inline-flex w-35 shrink-0 snap-start flex-col items-center justify-center rounded-2xl border border-green-100 bg-green-50/50 p-4 text-center transition-colors hover:bg-green-50 sm:mr-0 sm:w-auto sm:p-6"
              >
                <span className="text-sm font-semibold text-green-900">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Curated Products */}
      <section className="bg-green-50/30 py-16 sm:py-24" aria-labelledby="curated-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 id="curated-heading" className="text-2xl font-bold tracking-tight text-green-950 sm:text-3xl">
              Explore the Menu
            </h2>
            <Link href="/menu" className="hidden text-sm font-semibold text-green-700 hover:text-green-900 sm:block">
              View all products <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {curatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center sm:hidden">
            <Link
              href="/menu"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-green-900 shadow-sm ring-1 ring-inset ring-green-200 hover:bg-green-50 active:scale-95 transition-transform"
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Bulk Order Banner */}
      <section className="bg-white py-16 sm:py-24" aria-labelledby="bulk-order-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-green-950 px-6 py-16 shadow-xl sm:px-12 sm:py-20 md:px-16 lg:flex lg:items-center lg:justify-between lg:px-24 lg:py-20">
            {/* Decorative background gradient */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-green-400 via-green-800 to-green-950" aria-hidden="true"></div>
            
            <div className="relative max-w-xl text-center lg:text-left">
              <h2 id="bulk-order-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Planning an event?
              </h2>
              <p className="mt-4 text-lg text-green-100">
                Nutri Delight accepts bulk orders for your special occasions. Ensure your guests enjoy healthy and fresh food.
              </p>
            </div>
            
            <div className="relative mt-10 flex justify-center lg:mt-0 lg:shrink-0">
              <Link
                href="/bulk-order"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-green-950 shadow-sm transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
              >
                Learn About Bulk Orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
