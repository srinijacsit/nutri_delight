"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/lib/config/navigation";

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close menu on route change by deriving state during render
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isOpen) {
      setIsOpen(false);
    }
  }

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling on body when open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors active:scale-95"
        aria-label="Open main menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <nav
            className="relative flex w-[85%] max-w-sm flex-col bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200 z-50"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <span className="font-extrabold text-stone-900 text-lg tracking-tight">Navigation</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="px-3 py-4 space-y-1 overflow-y-auto">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
