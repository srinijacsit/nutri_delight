"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";

interface ApiOrderItem {
  product_name_snapshot: string;
  option_name_snapshot?: string;
  quantity: number;
  unit_price_snapshot: string | number;
  option_price_snapshot?: string | number;
  line_total: number;
}

interface ApiOrder {
  id: string;
  order_number: string;
  total: number;
  customer_name_snapshot: string;
  customer_phone_snapshot: string;
  customer_notes?: string;
  order_items?: ApiOrderItem[];
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadOrder() {
      try {
        const stored = sessionStorage.getItem("nutridelight-last-order");
        if (stored) {
          const storedOrder = JSON.parse(stored);
          if (storedOrder?.id) {
            const fullOrder = await apiClient.get(`/orders/${storedOrder.id}`);
            setOrder(fullOrder as ApiOrder);
          }
        }
      } catch (e: unknown) {
        console.error("Failed to load order", e);
        if (typeof e === 'object' && e !== null && 'status' in e && (e as {status?: number}).status === 401) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [router]);

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
          <h1 className="relative text-4xl font-extrabold text-foreground tracking-tight mb-4">Order Received!</h1>
          <p className="relative text-lg text-foreground/70 max-w-lg mx-auto">
            Your order <strong>{order.order_number}</strong> has been successfully placed and is being prepared.
          </p>
        </div>
        
        <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">Customer Details</h2>
          <dl className="space-y-6 text-base">
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-5">
              <dt className="text-foreground/60 font-bold col-span-1">Name</dt>
              <dd className="text-foreground font-bold col-span-2">{order.customer_name_snapshot}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-5">
              <dt className="text-foreground/60 font-bold col-span-1">Phone</dt>
              <dd className="text-foreground font-bold col-span-2">{order.customer_phone_snapshot}</dd>
            </div>
            {order.customer_notes && (
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-5">
                <dt className="text-foreground/60 font-bold col-span-1">Notes</dt>
                <dd className="text-foreground font-bold col-span-2 italic">{order.customer_notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-sm mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">Order Summary</h2>
          <ul className="divide-y divide-border mb-8 border-b border-border">
            {order.order_items?.map((item, idx: number) => (
              <li key={idx} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-foreground">{item.product_name_snapshot}</h4>
                  {item.option_name_snapshot && (
                    <p className="inline-block px-2 py-0.5 mt-1.5 rounded bg-primary/10 text-[11px] font-bold text-primary">
                      + {item.option_name_snapshot}
                    </p>
                  )}
                  <p className="text-sm font-medium text-foreground/60 mt-2">Qty: {item.quantity} × ₹{Number(item.unit_price_snapshot) + Number(item.option_price_snapshot || 0)}</p>
                </div>
                <div className="text-base font-extrabold text-foreground sm:text-right tracking-tight">
                  ₹{item.line_total}
                </div>
              </li>
            ))}
          </ul>
          
          <dl className="space-y-5 text-base text-foreground/70">
            <div className="flex justify-between">
              <dt className="font-medium">Total Items</dt>
              <dd className="font-bold text-foreground">{order.order_items?.reduce((sum: number, item) => sum + item.quantity, 0) || 0}</dd>
            </div>
            <div className="flex justify-between pt-5 border-t border-border">
              <dt className="text-lg font-bold text-foreground">Total Paid</dt>
              <dd className="text-2xl font-extrabold text-foreground tracking-tight">₹{order.total}</dd>
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
