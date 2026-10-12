"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Printer, ArrowRight } from "lucide-react";
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
  created_at: string;
  status: string;
  order_type: string;
  order_number: string;
  total: number;
  customer_name_snapshot: string;
  customer_phone_snapshot: string;
  customer_notes?: string;
  event_date?: string;
  event_time?: string;
  order_items?: ApiOrderItem[];
}

export default function BulkSuccessPage() {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadOrder() {
      try {
        const stored = sessionStorage.getItem("nutridelight-bulk-last-order");
        if (stored) {
          const storedOrder = JSON.parse(stored);
          if (storedOrder?.id) {
            const fullOrder = await apiClient.get(`/orders/${storedOrder.id}`);
            setOrder(fullOrder as ApiOrder);
          }
        }
      } catch (e: unknown) {
        console.error("Failed to load bulk order", e);
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
          <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight">No Bulk Order Found</h1>
          <p className="relative text-base text-foreground/60 mb-10 leading-relaxed">We couldn&apos;t find your recent bulk order details.</p>
          <Link
            href="/bulk-order"
            className="relative flex items-center justify-center w-full rounded-full bg-primary px-8 py-5 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Start Bulk Order
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-[2rem] p-8 sm:p-12 border border-border shadow-xl mb-10 text-center relative overflow-hidden print:border-none print:shadow-none print:mb-4 print:p-0">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent pointer-events-none print:hidden" />
          <div className="relative mx-auto w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/10 print:hidden">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="relative text-4xl font-extrabold text-foreground tracking-tight mb-4">Bulk Order Received!</h1>
          <p className="relative text-lg text-foreground/70 print:hidden max-w-lg mx-auto">
            Your bulk order <strong>{order.order_number}</strong> has been received successfully. Review your estimate below.
          </p>
        </div>
        
        {/* Bill Preview */}
        <div className="bg-card rounded-[2rem] p-8 sm:p-12 border border-border shadow-sm mb-10 print:border-stone-300 print:shadow-none print:rounded-none">
          <div className="text-center mb-10 pb-10 border-b border-border">
            <h2 className="text-3xl font-extrabold text-foreground tracking-widest uppercase mb-2">Nutri Delight</h2>
            <p className="text-foreground/60 font-bold tracking-widest uppercase text-sm">Bulk Order Estimate</p>
            <p className="text-sm text-foreground/40 mt-3 font-medium">Generated: {new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-sm font-extrabold text-foreground/40 uppercase tracking-widest mb-4">Customer Details</h3>
              <p className="text-foreground font-bold text-lg mb-1">{order.customer_name_snapshot}</p>
              <p className="text-foreground/70 font-medium">{order.customer_phone_snapshot}</p>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground/40 uppercase tracking-widest mb-4">Delivery Schedule</h3>
              <p className="text-foreground font-bold text-lg mb-1">{order.event_date ? new Date(order.event_date).toLocaleDateString() : 'N/A'}</p>
              <p className="text-foreground/70 font-medium">{order.event_date ? new Date(order.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</p>
            </div>
          </div>

          <table className="w-full text-left text-base mb-10 border-collapse">
            <thead className="border-b-2 border-border">
              <tr>
                <th className="py-4 font-extrabold text-foreground tracking-wide">Item</th>
                <th className="py-4 font-extrabold text-foreground tracking-wide text-center">Qty</th>
                <th className="py-4 font-extrabold text-foreground tracking-wide text-right">Price</th>
                <th className="py-4 font-extrabold text-foreground tracking-wide text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {order.order_items?.map((item, idx: number) => (
                <tr key={idx} className="group hover:bg-stone-50/50 transition-colors print:hover:bg-transparent">
                  <td className="py-5 pr-4">
                    <p className="font-bold text-foreground">{item.product_name_snapshot}</p>
                    {item.option_name_snapshot && <p className="inline-block px-2 py-0.5 mt-1.5 rounded bg-primary/10 text-[11px] font-bold text-primary">+ {item.option_name_snapshot}</p>}
                  </td>
                  <td className="py-5 text-center font-bold text-foreground/70">{item.quantity}</td>
                  <td className="py-5 text-right font-medium text-foreground/70">₹{Number(item.unit_price_snapshot) + Number(item.option_price_snapshot || 0)}</td>
                  <td className="py-5 text-right font-extrabold text-foreground tracking-tight">₹{item.line_total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-8 border-t-2 border-border">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="flex justify-between text-base mb-4">
                <span className="text-foreground/60 font-medium">Total Items</span>
                <span className="font-bold text-foreground">{order.order_items?.reduce((sum: number, item) => sum + item.quantity, 0) || 0}</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold mt-6 pt-6 border-t-2 border-border tracking-tight">
                <span className="text-foreground">Estimate</span>
                <span className="text-foreground">₹{order.total}</span>
              </div>
            </div>
          </div>
          
          {order.customer_notes && (
             <div className="mt-12 pt-8 border-t border-border/50">
               <h3 className="text-sm font-extrabold text-foreground/40 uppercase tracking-widest mb-3">Special Instructions</h3>
               <p className="text-base text-foreground/80 font-medium italic bg-stone-50 p-5 rounded-xl border border-border">{order.customer_notes}</p>
             </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-5 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center rounded-full bg-card border-2 border-border px-8 py-5 text-base font-bold text-foreground shadow-sm hover:bg-stone-50 active:scale-95 transition-all hover:border-primary/30"
          >
            <Printer className="w-5 h-5 mr-3 text-foreground/50" />
            Download / Print Bill
          </button>
          <Link
            href="/bulk-order"
            className="flex-1 flex items-center justify-center rounded-full bg-primary px-8 py-5 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all group"
          >
            Start New Bulk Order
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
