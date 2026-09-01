import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Utensils, Droplet, Sparkles, Flame, Apple, Leaf } from "lucide-react";
import { menu } from "@/lib/data/menu";
import { ProductCard } from "@/components/ui/product-card";

// 1. Derive categories dynamically
const categories = Array.from(new Set(menu.map((item) => item.category)));

// 2. Curate real products dynamically
const curatedProducts = [
  menu.find((p) => p.id === "watermelon"),
  menu.find((p) => p.id === "chicken-roll"),
  menu.find((p) => p.id === "multi-millet-dosa"),
  menu.find((p) => p.id === "badam-milk"),
].filter(Boolean) as typeof menu;

// Icon mapping for premium visual discovery
const categoryIcons: Record<string, React.ElementType> = {
  "Tea / Coffee": Coffee,
  "Pani Puri": Sparkles,
  "Healthy Tiffins": Apple,
  "Flavored Milk": Droplet,
  "Fresh Fruit Juices": Leaf,
  "Evening Snacks": Utensils,
  "3PM Snacks": Flame,
};

export default function CustomerHome() {
  return (
    <div className="flex flex-col w-full bg-[#FCFBF8]">
      {/* 1. Hero Section */}
      <section className="relative px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-32 lg:px-8 max-w-7xl mx-auto w-full" aria-labelledby="hero-heading">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 relative h-20 w-20 sm:h-28 sm:w-28 rounded-full overflow-hidden shadow-sm ring-1 ring-stone-200">
            <Image
              src="/brand/nutridelight-logo.jpeg"
              alt="Nutri Delight"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl mb-4">
            Fresh, Healthy, <br className="hidden sm:block" />
            <span className="text-green-700">Delivered.</span>
          </h1>
          <p className="text-lg font-medium text-stone-500 sm:text-xl mb-10 max-w-2xl px-4">
            Premium quality healthy food and fresh juices in Bhimavaram. Taste the difference today.
          </p>
          <div className="flex w-full px-4 sm:px-0 sm:w-auto">
            <Link
              href="/menu"
              className="group flex w-full sm:w-auto items-center justify-center rounded-full bg-green-700 px-8 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-green-800 hover:shadow-md active:scale-95"
            >
              Order Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Category Discovery */}
      <section className="bg-white py-12 sm:py-20 border-y border-stone-100" aria-labelledby="category-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="category-heading" className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl mb-8">
            Explore Categories
          </h2>
          <div className="flex overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 gap-4" style={{ scrollbarWidth: "none" }}>
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Utensils;
              const count = menu.filter(p => p.category === category).length;
              return (
                <Link
                  key={category}
                  href="/menu"
                  className="group relative flex w-[130px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border border-stone-100 bg-white p-5 shadow-sm transition-all hover:border-green-200 hover:shadow-md sm:w-[150px]"
                >
                  <div className="mb-3 rounded-full bg-[#FCFBF8] p-3 text-green-700 transition-colors group-hover:bg-green-50">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-center text-sm font-bold text-stone-800 leading-tight mb-1">{category}</h3>
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{count} items</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Real Product Discovery */}
      <section className="bg-[#FCFBF8] py-16 sm:py-24" aria-labelledby="curated-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 id="curated-heading" className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Customer Favorites
            </h2>
            <Link href="/menu" className="hidden text-sm font-bold text-green-700 hover:text-green-800 sm:flex items-center group transition-colors">
              View all <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {curatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/menu"
              className="flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-bold text-stone-900 shadow-sm border border-stone-200 hover:bg-stone-50 active:scale-95 transition-all"
            >
              View full menu
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Bulk Order Banner */}
      <section className="bg-white py-16 sm:py-24 border-t border-stone-100" aria-labelledby="bulk-order-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-stone-900 px-6 py-12 shadow-xl sm:px-12 sm:py-16 md:px-16 lg:flex lg:items-center lg:justify-between lg:px-20 lg:py-20">
            <div className="relative max-w-xl text-center lg:text-left">
              <h2 id="bulk-order-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Catering & Bulk Orders
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-300">
                Planning an event in Bhimavaram? Ensure your guests enjoy healthy, premium, and freshly prepared food with our catering services.
              </p>
            </div>
            <div className="relative mt-8 flex justify-center lg:mt-0 lg:shrink-0">
              <Link
                href="/bulk-order"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-500 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
