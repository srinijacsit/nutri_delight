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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between relative">
          
          {/* Mobile Menu - Left */}
          <div className="flex items-center sm:hidden">
            <MobileNav />
          </div>

          {/* Logo - Center (Mobile) / Left (Desktop) */}
          <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90 active:opacity-80" aria-label="Nutri Delight Home">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden shadow-sm border-2 border-white">
                <Image
                  src="/brand/nutridelight-logo.jpeg"
                  alt="Nutri Delight Logo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 48px, 56px"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight hidden sm:block">
                Nutri Delight
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Center */}
          <nav className="hidden sm:flex flex-1 items-center justify-center gap-2 mx-6" aria-label="Main Navigation">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-stone-100/50 hover:text-foreground"
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
              className="relative p-3 text-foreground/80 hover:text-foreground hover:bg-stone-100/50 focus:outline-none rounded-full transition-all active:scale-95 flex items-center justify-center"
              aria-label="View cart"
            >
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground ring-2 ring-background shadow-sm">
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
