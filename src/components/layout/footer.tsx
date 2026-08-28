import Link from "next/link";
import { footerNav } from "@/lib/config/navigation";

export function Footer() {
  return (
    <footer className="border-t border-green-100 bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-xl font-bold text-green-950 tracking-tight">Nutri Delight</span>
            <p className="text-sm text-green-700">Making Bhimavaram Healthy</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer Navigation">
            {footerNav.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-sm font-medium text-green-800 hover:text-green-950 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-green-50 pt-8 flex items-center justify-center md:justify-start">
          <p className="text-sm text-green-600">
            &copy; {new Date().getFullYear()} Nutri Delight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
