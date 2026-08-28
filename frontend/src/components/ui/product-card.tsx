import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-green-200 group">
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800 tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-green-950 group-hover:text-green-800 transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-bold text-green-900">₹{product.price}</span>
        {/* Placeholder button style for future add-to-cart functionality */}
        <button 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-800 transition-colors hover:bg-green-100 hover:text-green-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 active:scale-95"
          aria-label={`View details for ${product.name}`}
        >
          <span className="text-lg leading-none mb-0.5" aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
