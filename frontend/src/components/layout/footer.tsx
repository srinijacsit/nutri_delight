import Link from "next/link";
import { footerNav } from "@/lib/config/navigation";

export function Footer() {
  return (
    <footer className="bg-background pt-20 pb-16 border-t border-border mt-auto" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8">
          <div className="flex flex-col items-center md:items-start space-y-5">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">Nutri Delight</span>
            <p className="text-base text-foreground/70 text-center md:text-left max-w-xs leading-relaxed">
              Making Bhimavaram Healthy. Order fresh, premium quality food and juices online.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-6 lg:mx-auto">
            <h3 className="text-sm font-bold tracking-widest text-foreground uppercase">Quick Links</h3>
            <nav className="flex flex-col items-center md:items-start space-y-4" aria-label="Footer Navigation">
              {footerNav.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="text-base font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-6 lg:ml-auto">
            <h3 className="text-sm font-bold tracking-widest text-foreground uppercase">Location</h3>
            <div className="flex flex-col items-center md:items-start space-y-2">
              <p className="text-base text-foreground font-medium">Bhimavaram, Andhra Pradesh</p>
              <p className="text-sm text-foreground/60 max-w-xs text-center md:text-left">
                (Pickup & Bulk Orders available)
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-20 border-t border-border pt-8 flex items-center justify-center">
          <p className="text-sm text-foreground/50 font-medium">
            &copy; {new Date().getFullYear()} Nutri Delight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
