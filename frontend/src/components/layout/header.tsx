"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { mainNav } from "@/lib/config/navigation";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-green-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95" aria-label="Nutri Delight Home">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-sm">
                <Image
                  src="/brand/nutridelight-logo.jpeg"
                  alt="Nutri Delight Logo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40px, 48px"
                  priority
                />
              </div>
              <span className="hidden sm:inline-block text-xl font-bold text-green-950 tracking-tight transition-colors">
                Nutri Delight
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 mx-6" aria-label="Main Navigation">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-green-100 text-green-900 shadow-sm"
                      : "text-green-800 hover:bg-green-50 hover:text-green-950"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Cart Button Foundation */}
            {/* No fake cart quantities are displayed until real state is connected */}
            <button 
              className="relative p-2 sm:p-3 text-green-800 hover:text-green-950 hover:bg-green-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-full transition-all active:scale-95 group flex items-center justify-center"
              aria-label="View cart"
            >
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" aria-hidden="true" />
            </button>

            {/* Mobile Nav Trigger */}
            <MobileNav />
          </div>

        </div>
      </div>
    </header>
  );
}
