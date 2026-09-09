import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { menu } from "@/lib/data/menu";
import { ProductCard } from "@/components/ui/product-card";
import { getCategoryImage } from "@/lib/image-mapping";

// 1. Derive categories dynamically
const categories = Array.from(new Set(menu.map((item) => item.category)));

// 2. Curate real products dynamically
const curatedProducts = [
  menu.find((p) => p.id === "watermelon"),
  menu.find((p) => p.id === "chicken-roll"),
  menu.find((p) => p.id === "multi-millet-dosa"),
  menu.find((p) => p.id === "badam-milk"),
].filter(Boolean) as typeof menu;

export default function CustomerHome() {
  return (
    <div className="flex flex-col w-full bg-background">
      {/* 1. Hero Section */}
      <section className="relative px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden" aria-labelledby="hero-heading">
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-10 relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50">
            <Image
              src="/brand/nutridelight-logo.jpeg"
              alt="Nutri Delight"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 id="hero-heading" className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl mb-6 leading-[1.1]">
            Fresh, Healthy, <br className="hidden sm:block" />
            <span className="text-primary bg-clip-text">Delivered.</span>
          </h1>
          <p className="text-lg font-medium text-foreground/70 sm:text-2xl mb-12 max-w-2xl px-4 leading-relaxed">
            Premium quality healthy food and fresh juices in Bhimavaram. Taste the difference today.
          </p>
          <div className="flex w-full px-4 sm:px-0 sm:w-auto">
            <Link
              href="/menu"
              className="group flex w-full sm:w-auto items-center justify-center rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              Order Now
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Category Discovery */}
      <section className="bg-card py-16 sm:py-24 border-y border-border" aria-labelledby="category-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="category-heading" className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-12">
            Explore Categories
          </h2>
          <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 gap-6" style={{ scrollbarWidth: "none" }}>
            {categories.map((category) => {
              const count = menu.filter(p => p.category === category).length;
              const imageSrc = getCategoryImage(category);
              return (
                <Link
                  key={category}
                  href="/menu"
                  className="group relative flex w-40 shrink-0 snap-start flex-col items-center overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-all hover:border-primary/30 hover:shadow-xl sm:w-45"
                >
                  <div className="relative w-full aspect-4/3 bg-muted overflow-hidden">
                    <Image 
                      src={imageSrc}
                      alt={category}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
                  </div>
                  <div className="flex flex-col items-center justify-center p-5 w-full bg-card z-10 -mt-2 rounded-t-3xl transition-transform group-hover:-translate-y-2">
                    <h3 className="text-center text-sm sm:text-base font-bold text-foreground leading-tight mb-1.5">{category}</h3>
                    <p className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">{count} items</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Real Product Discovery */}
      <section className="bg-background py-20 sm:py-32" aria-labelledby="curated-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 id="curated-heading" className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Customer Favorites
            </h2>
            <Link href="/menu" className="hidden text-base font-bold text-primary hover:text-primary/80 sm:flex items-center group transition-colors">
              View all menu <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {curatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 flex justify-center sm:hidden">
            <Link
              href="/menu"
              className="flex w-full items-center justify-center rounded-full bg-card px-8 py-5 text-base font-bold text-foreground shadow-sm border border-border hover:bg-stone-50 active:scale-95 transition-all"
            >
              View full menu
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Bulk Order Banner */}
      <section className="bg-card py-20 sm:py-32 border-t border-border" aria-labelledby="bulk-order-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3rem] bg-stone-900 px-8 py-16 shadow-2xl sm:px-16 sm:py-20 md:px-20 lg:flex lg:items-center lg:justify-between lg:px-24 lg:py-24">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-linear-to-br from-stone-800 to-stone-950" />
            
            <div className="relative max-w-2xl text-center lg:text-left z-10">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white mb-6 backdrop-blur-md">
                For Events & Parties
              </span>
              <h2 id="bulk-order-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                Premium Catering
              </h2>
              <p className="mt-4 text-lg sm:text-xl leading-relaxed text-stone-300">
                Planning an event in Bhimavaram? Ensure your guests enjoy healthy, premium, and freshly prepared food with our catering services.
              </p>
            </div>
            <div className="relative mt-12 flex justify-center lg:mt-0 lg:shrink-0 z-10">
              <Link
                href="/bulk-order"
                className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                Explore Bulk Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
