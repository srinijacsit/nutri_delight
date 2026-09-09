"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBulkCart } from "@/contexts/bulk-cart-context";
import { ArrowLeft, UserCircle } from "lucide-react";

export default function BulkDetailsPage() {
  const { items, totalItems, totalPrice, isHydrated, clearCart } = useBulkCart();
  const router = useRouter();

  const [mode, setMode] = useState<"auto" | "manual">("manual");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return <div className="min-h-screen bg-background"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-24">
        <div className="bg-card p-10 rounded-[2rem] border border-border shadow-xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
          <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight">Bulk Cart is empty</h1>
          <p className="relative text-base text-foreground/60 mb-10 leading-relaxed">You need items in your bulk cart to proceed.</p>
          <Link
            href="/bulk-order"
            className="relative flex items-center justify-center w-full rounded-full bg-primary px-8 py-5 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Browse Bulk Menu
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (mode === "manual") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
        isValid = false;
      } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        newErrors.phone = "Valid 10-digit number required";
        isValid = false;
      }
    } else {
      // Auto mode is a stub, block validation to prevent fake submission
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = "Delivery date is required";
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = "Delivery time is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      const payloadCustomer = { name: formData.name, phone: formData.phone, notes: formData.notes };

      const orderPayload = {
        type: "BULK_ORDER",
        date: new Date().toISOString(),
        delivery: {
          date: formData.date,
          time: formData.time,
        },
        customer: payloadCustomer,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          option: item.option ? item.option.name : null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.unitPrice * item.quantity
        })),
        summary: {
          totalItems,
          totalPrice
        }
      };

      setTimeout(() => {
        sessionStorage.setItem("nutridelight-bulk-last-order", JSON.stringify(orderPayload));
        clearCart();
        router.push("/bulk-order/success");
      }, 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/bulk-order/cart" className="inline-flex items-center text-sm font-bold text-foreground/50 hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Bulk Cart
        </Link>
        
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-10">Bulk Order Details</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary to-primary/50" />
              <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">Customer Information</h2>
              
              <div className="flex bg-stone-100/50 rounded-xl p-1.5 mb-8 border border-border shadow-inner">
                <button
                  type="button"
                  onClick={() => setMode("manual")}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === "manual" ? "bg-white text-foreground shadow-sm ring-1 ring-border" : "text-foreground/50 hover:text-foreground/80"}`}
                >
                  Enter Details
                </button>
                <button
                  type="button"
                  onClick={() => setMode("auto")}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === "auto" ? "bg-white text-foreground shadow-sm ring-1 ring-border" : "text-foreground/50 hover:text-foreground/80"}`}
                >
                  Use Saved Details
                </button>
              </div>

              {mode === "auto" ? (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
                  <UserCircle className="relative w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <h3 className="relative text-xl font-bold text-primary mb-2">Backend Integration Point</h3>
                  <p className="relative text-sm text-primary/70 leading-relaxed max-w-md mx-auto">
                    Authentication is not yet connected. When the backend is ready, this will auto-fill using your authenticated profile.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-foreground/70 mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-2 bg-background py-4 px-5 text-foreground font-medium placeholder:text-foreground/30 focus:outline-none transition-colors ${errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                      placeholder="Organization or Contact Name"
                    />
                    {errors.name && <p className="mt-2 text-sm text-destructive font-bold flex items-center"><span className="w-1 h-1 rounded-full bg-destructive mr-2 inline-block"></span>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-foreground/70 mb-2">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border-2 bg-background py-4 px-5 text-foreground font-medium placeholder:text-foreground/30 focus:outline-none transition-colors ${errors.phone ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="mt-2 text-sm text-destructive font-bold flex items-center"><span className="w-1 h-1 rounded-full bg-destructive mr-2 inline-block"></span>{errors.phone}</p>}
                  </div>
                </div>
              )}
            </div>

            <form id="bulk-checkout-form" onSubmit={handleSubmit} className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary to-primary/50" />
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-bold text-foreground/70 mb-2">
                    Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-2 bg-background py-4 px-5 text-foreground font-medium focus:outline-none transition-colors ${errors.date ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                  />
                  {errors.date && <p className="mt-2 text-sm text-destructive font-bold flex items-center"><span className="w-1 h-1 rounded-full bg-destructive mr-2 inline-block"></span>{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-bold text-foreground/70 mb-2">
                    Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border-2 bg-background py-4 px-5 text-foreground font-medium focus:outline-none transition-colors ${errors.time ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
                  />
                  {errors.time && <p className="mt-2 text-sm text-destructive font-bold flex items-center"><span className="w-1 h-1 rounded-full bg-destructive mr-2 inline-block"></span>{errors.time}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-bold text-foreground/70 mb-2">
                  Special Instructions <span className="text-foreground/40 font-medium">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-2 border-border bg-background py-4 px-5 text-foreground font-medium placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="e.g. Packing requirements, dietary notes"
                />
              </div>
            </form>

          </div>

          <div className="mt-10 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-xl sticky top-32 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-stone-50/50 to-transparent pointer-events-none" />
              <h2 className="relative text-2xl font-extrabold text-foreground mb-8 tracking-tight">Bulk Order Summary</h2>
              
              <div className="relative flow-root mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                <ul className="divide-y divide-border/50">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-foreground">{item.product.name}</h4>
                        {item.option && (
                          <span className="inline-block px-2 py-0.5 mt-2 rounded bg-primary/10 text-[11px] font-bold text-primary">
                            + {item.option.name}
                          </span>
                        )}
                        <p className="text-sm font-medium text-foreground/50 mt-2">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                      </div>
                      <div className="text-base font-extrabold text-foreground sm:text-right tracking-tight">
                        ₹{item.unitPrice * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <dl className="relative space-y-5 text-base text-foreground/70 mb-10 pt-6 border-t-2 border-border">
                <div className="flex justify-between pb-5 border-b border-border">
                  <dt className="font-medium">Items ({totalItems})</dt>
                  <dd className="font-bold text-foreground">₹{totalPrice}</dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="text-xl font-bold text-foreground">Estimated Total</dt>
                  <dd className="text-2xl font-extrabold text-foreground tracking-tight">₹{totalPrice}</dd>
                </div>
              </dl>

              <button
                type="submit"
                form="bulk-checkout-form"
                disabled={isSubmitting || mode === "auto"}
                className="relative w-full flex items-center justify-center rounded-full bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed group overflow-hidden"
              >
                {isSubmitting && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                <span className="relative">{mode === "auto" ? "Authentication Required" : isSubmitting ? "Processing..." : "Confirm Details"}</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
