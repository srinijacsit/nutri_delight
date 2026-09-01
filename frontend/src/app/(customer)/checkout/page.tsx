"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { ArrowLeft, ShoppingBag, CheckCircle } from "lucide-react";

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
  const [isSuccess, setIsSuccess] = useState(false);

  // Wait for hydration
  if (!isHydrated) {
    return <div className="min-h-screen bg-[#FCFBF8]"></div>;
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Cart is empty</h1>
          <p className="text-stone-500 mb-8">You need items in your cart to checkout.</p>
          <Link
            href="/menu"
            className="flex items-center justify-center w-full rounded-full bg-green-600 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Order Prepared</h1>
          <p className="text-stone-500 mb-8">Your order payload is ready for backend integration.</p>
          <button
            onClick={() => {
              clearCart();
              router.push("/menu");
            }}
            className="flex items-center justify-center w-full rounded-full bg-stone-900 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-stone-800 active:scale-95 transition-all"
          >
            Start New Order
          </button>
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
        setIsSubmitting(false);
        setIsSuccess(true);
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
    <div className="min-h-screen bg-[#FCFBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/cart" className="inline-flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>
        
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors ${errors.name ? 'border-red-500' : 'border-stone-200'}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-stone-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors ${errors.phone ? 'border-red-500' : 'border-stone-200'}`}
                    placeholder="Enter 10-digit mobile number"
                  />
                  {errors.phone && <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-bold text-stone-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-stone-200 bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                    placeholder="Any special instructions?"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Review */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Order Review</h2>
              
              <div className="flow-root mb-6 max-h-[40vh] overflow-y-auto pr-2">
                <ul className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-stone-900">{item.product.name}</h4>
                        {item.option && (
                          <p className="text-xs font-semibold text-green-700 mt-0.5">
                            + {item.option.name}
                          </p>
                        )}
                        <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                      </div>
                      <div className="text-sm font-extrabold text-stone-900 sm:text-right">
                        ₹{item.unitPrice * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <dl className="space-y-4 text-sm text-stone-600 mb-6 pt-4 border-t border-stone-100">
                <div className="flex justify-between pb-4 border-b border-stone-100">
                  <dt>Items ({totalItems})</dt>
                  <dd className="font-medium text-stone-900">₹{totalPrice}</dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="text-base font-bold text-stone-900">Total to pay</dt>
                  <dd className="text-lg font-extrabold text-stone-900">₹{totalPrice}</dd>
                </div>
              </dl>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center rounded-full bg-green-600 px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
