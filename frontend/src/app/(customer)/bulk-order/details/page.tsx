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
    return <div className="min-h-screen bg-[#FCFBF8]"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Bulk Cart is empty</h1>
          <p className="text-stone-500 mb-8">You need items in your bulk cart to proceed.</p>
          <Link
            href="/bulk-order"
            className="flex items-center justify-center w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
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
    <div className="min-h-screen bg-[#FCFBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/bulk-order/cart" className="inline-flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bulk Cart
        </Link>
        
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-8">Bulk Order Details</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Customer Information</h2>
              
              <div className="flex bg-stone-100 rounded-lg p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setMode("manual")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === "manual" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Enter Details
                </button>
                <button
                  type="button"
                  onClick={() => setMode("auto")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === "auto" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Use Saved Details
                </button>
              </div>

              {mode === "auto" ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                  <UserCircle className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-blue-900 mb-1">Backend Integration Point</h3>
                  <p className="text-sm text-blue-700">
                    Authentication is not yet connected. When the backend is ready, this will auto-fill using your authenticated profile.
                  </p>
                </div>
              ) : (
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
                      className={`block w-full rounded-lg border bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.name ? 'border-red-500' : 'border-stone-200'}`}
                      placeholder="Organization or Contact Name"
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
                      className={`block w-full rounded-lg border bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.phone ? 'border-red-500' : 'border-stone-200'}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>}
                  </div>
                </div>
              )}
            </div>

            <form id="bulk-checkout-form" onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-stone-900 mb-2">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-bold text-stone-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.date ? 'border-red-500' : 'border-stone-200'}`}
                  />
                  {errors.date && <p className="mt-2 text-sm text-red-600 font-medium">{errors.date}</p>}
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-bold text-stone-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.time ? 'border-red-500' : 'border-stone-200'}`}
                  />
                  {errors.time && <p className="mt-2 text-sm text-red-600 font-medium">{errors.time}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-bold text-stone-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-stone-200 bg-stone-50 py-3 px-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. Packing requirements, dietary notes"
                />
              </div>
            </form>

          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Bulk Order Summary</h2>
              
              <div className="flow-root mb-6 max-h-[40vh] overflow-y-auto pr-2">
                <ul className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-stone-900">{item.product.name}</h4>
                        {item.option && (
                          <p className="text-xs font-semibold text-blue-700 mt-0.5">
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
                  <dt className="text-base font-bold text-stone-900">Estimated Total</dt>
                  <dd className="text-lg font-extrabold text-stone-900">₹{totalPrice}</dd>
                </div>
              </dl>

              <button
                type="submit"
                form="bulk-checkout-form"
                disabled={isSubmitting || mode === "auto"}
                className="w-full flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {mode === "auto" ? "Authentication Required" : isSubmitting ? "Processing..." : "Confirm Details"}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
