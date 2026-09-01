import Link from "next/link";
import { footerNav } from "@/lib/config/navigation";

export function Footer() {
  return (
    <footer className="bg-[#FCFBF8] pt-16 pb-12 sm:pt-20 sm:pb-16 border-t border-stone-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">Nutri Delight</span>
            <p className="text-base text-stone-500 text-center md:text-left max-w-xs">
              Making Bhimavaram Healthy. Order fresh, premium quality food and juices online.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-5 lg:mx-auto">
            <h3 className="text-xs font-bold tracking-widest text-stone-900 uppercase">Quick Links</h3>
            <nav className="flex flex-col items-center md:items-start space-y-3" aria-label="Footer Navigation">
              {footerNav.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="text-base font-medium text-stone-500 hover:text-green-700 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-5 lg:ml-auto">
            <h3 className="text-xs font-bold tracking-widest text-stone-900 uppercase">Location</h3>
            <p className="text-base text-stone-600 font-medium">Bhimavaram, Andhra Pradesh</p>
            <p className="text-sm text-stone-500 max-w-xs text-center md:text-left mt-2">
              (Pickup & Bulk Orders available)
            </p>
          </div>
        </div>
        
        <div className="mt-16 border-t border-stone-200 pt-8 flex items-center justify-center">
          <p className="text-sm text-stone-400 font-medium">
            &copy; {new Date().getFullYear()} Nutri Delight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
