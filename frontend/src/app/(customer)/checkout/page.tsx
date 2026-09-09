"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, isHydrated, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wait for hydration
  if (!isHydrated) {
    return <div className="min-h-screen bg-background"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-24">
        <div className="bg-card p-10 rounded-[2rem] border border-border shadow-xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight">Cart is empty</h1>
          <p className="relative text-base text-foreground/60 mb-10 leading-relaxed">You need items in your cart to checkout.</p>
          <Link
            href="/menu"
            className="relative flex items-center justify-center w-full rounded-full bg-primary px-8 py-5 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", phone: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      // Mock order preparation logic
      const orderPayload = {
        date: new Date().toISOString(),
        customer: {
          name: formData.name,
          phone: formData.phone,
          notes: formData.notes
        },
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
      
      console.log("Mock Order Payload:", orderPayload);
      
      // Simulate network request
      setTimeout(() => {
        // Temporary frontend order history persistence
        const historyStr = localStorage.getItem("nutridelight-order-history");
        const history = historyStr ? JSON.parse(historyStr) : [];
        history.unshift(orderPayload);
        localStorage.setItem("nutridelight-order-history", JSON.stringify(history));

        sessionStorage.setItem("nutridelight-last-order", JSON.stringify(orderPayload));
        clearCart();
        router.push("/confirmation");
      }, 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/cart" className="inline-flex items-center text-sm font-bold text-foreground/60 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>
        
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-10">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm">
              <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-foreground/80 mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border bg-background py-4 px-5 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.name ? 'border-destructive' : 'border-border'}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-destructive font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-foreground/80 mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full rounded-xl border bg-background py-4 px-5 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.phone ? 'border-destructive' : 'border-border'}`}
                    placeholder="Enter 10-digit mobile number"
                  />
                  {errors.phone && <p className="mt-2 text-sm text-destructive font-medium">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-bold text-foreground/80 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-border bg-background py-4 px-5 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Any special instructions?"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Review */}
          <div className="mt-10 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-xl sticky top-32 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-stone-50/50 to-transparent pointer-events-none" />
              <h2 className="relative text-2xl font-extrabold text-foreground mb-8 tracking-tight">Order Review</h2>
              
              <div className="relative flow-root mb-8 max-h-[40vh] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{item.product.name}</h4>
                        {item.option && (
                          <p className="inline-block px-2 py-0.5 mt-1 rounded bg-primary/10 text-[11px] font-bold text-primary">
                            + {item.option.name}
                          </p>
                        )}
                        <p className="text-xs font-medium text-foreground/60 mt-1.5">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                      </div>
                      <div className="text-base font-extrabold text-foreground sm:text-right tracking-tight">
                        ₹{item.unitPrice * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <dl className="relative space-y-5 text-base text-foreground/70 mb-8 pt-6 border-t border-border">
                <div className="flex justify-between pb-5 border-b border-border">
                  <dt className="font-medium">Items ({totalItems})</dt>
                  <dd className="font-bold text-foreground">₹{totalPrice}</dd>
                </div>
                <div className="flex justify-between pt-3">
                  <dt className="text-lg font-bold text-foreground">Total to pay</dt>
                  <dd className="text-2xl font-extrabold text-foreground tracking-tight">₹{totalPrice}</dd>
                </div>
              </dl>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="relative w-full flex items-center justify-center rounded-full bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
