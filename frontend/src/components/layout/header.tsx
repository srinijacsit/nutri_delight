"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { mainNav } from "@/lib/config/navigation";
import { MobileNav } from "./mobile-nav";
import { useCart } from "@/contexts/cart-context";

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between relative">
          
          {/* Mobile Menu - Left */}
          <div className="flex items-center sm:hidden">
            <MobileNav />
          </div>

          {/* Logo - Center (Mobile) / Left (Desktop) */}
          <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 active:opacity-80" aria-label="Nutri Delight Home">
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden border border-stone-200 shadow-sm">
                <Image
                  src="/brand/nutridelight-logo.jpeg"
                  alt="Nutri Delight Logo"
                  fill
                  className="object-cover"
                  sizes="40px"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                Nutri Delight
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Center */}
          <nav className="hidden sm:flex flex-1 items-center justify-center gap-1 mx-6" aria-label="Main Navigation">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? "bg-stone-100 text-stone-900"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions - Right */}
          <div className="flex items-center justify-end">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-none rounded-full transition-all active:scale-95 flex items-center justify-center"
              aria-label="View cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 flex h-4 w-4 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
