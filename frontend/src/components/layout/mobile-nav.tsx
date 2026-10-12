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
        className="p-3 -ml-3 text-foreground/80 hover:bg-stone-100/50 rounded-full transition-colors active:scale-95"
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
            className="relative flex w-[85%] max-w-sm flex-col bg-background h-full shadow-2xl animate-in slide-in-from-left duration-200 z-50 rounded-r-3xl"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-extrabold text-foreground text-xl tracking-tight">Navigation</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-foreground/60 hover:text-foreground hover:bg-stone-100/50 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="px-4 py-6 space-y-2 overflow-y-auto">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-5 py-4 rounded-2xl text-base font-bold transition-colors ${
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
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
