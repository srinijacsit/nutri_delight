"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  option: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderPayload {
  customer: {
    name: string;
    phone: string;
    notes: string;
  };
  items: OrderItem[];
  summary: {
    totalItems: number;
    totalPrice: number;
  };
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nutridelight-last-order");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse order", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-background"></div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-24">
        <div className="bg-card p-10 rounded-[2rem] border border-border shadow-xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight">No Order Found</h1>
          <p className="relative text-base text-foreground/60 mb-10 leading-relaxed">We couldn&apos;t find your recent order details.</p>
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

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-[2rem] p-8 sm:p-12 border border-border shadow-xl mb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent pointer-events-none" />
          <div className="relative mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 ring-8 ring-green-500/10">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="relative text-4xl font-extrabold text-foreground tracking-tight mb-4">Order Prepared</h1>
          <p className="relative text-lg text-foreground/70 max-w-lg mx-auto">
            Your order payload is ready for backend integration. We have saved your details locally for review.
          </p>
        </div>
        
        <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">Customer Details</h2>
          <dl className="space-y-6 text-base">
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-5">
              <dt className="text-foreground/60 font-bold col-span-1">Name</dt>
              <dd className="text-foreground font-bold col-span-2">{order.customer.name}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-5">
              <dt className="text-foreground/60 font-bold col-span-1">Phone</dt>
              <dd className="text-foreground font-bold col-span-2">{order.customer.phone}</dd>
            </div>
            {order.customer.notes && (
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-5">
                <dt className="text-foreground/60 font-bold col-span-1">Notes</dt>
                <dd className="text-foreground font-bold col-span-2 italic">{order.customer.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">Order Summary</h2>
          <ul className="divide-y divide-border mb-8 border-b border-border">
            {order.items.map((item, idx) => (
              <li key={idx} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-foreground">{item.name}</h4>
                  {item.option && (
                    <p className="inline-block px-2 py-0.5 mt-1.5 rounded bg-primary/10 text-[11px] font-bold text-primary">
                      + {item.option}
                    </p>
                  )}
                  <p className="text-sm font-medium text-foreground/60 mt-2">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                </div>
                <div className="text-base font-extrabold text-foreground sm:text-right tracking-tight">
                  ₹{item.lineTotal}
                </div>
              </li>
            ))}
          </ul>
          
          <dl className="space-y-5 text-base text-foreground/70">
            <div className="flex justify-between">
              <dt className="font-medium">Total Items</dt>
              <dd className="font-bold text-foreground">{order.summary.totalItems}</dd>
            </div>
            <div className="flex justify-between pt-5 border-t border-border">
              <dt className="text-lg font-bold text-foreground">Total Paid</dt>
              <dd className="text-2xl font-extrabold text-foreground tracking-tight">₹{order.summary.totalPrice}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            href="/menu"
            className="flex-1 flex items-center justify-center rounded-full bg-stone-100 px-8 py-5 text-base font-bold text-foreground shadow-sm hover:bg-stone-200 active:scale-95 transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center rounded-full bg-stone-900 px-8 py-5 text-base font-bold text-white shadow-lg hover:bg-stone-800 active:scale-95 transition-all group"
          >
            View Orders
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
