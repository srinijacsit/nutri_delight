"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  option: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderPayload {
  date?: string;
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderPayload[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nutridelight-order-history");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse order history", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  if (!isHydrated) {
    return <div className="min-h-screen bg-background"></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-24">
        <div className="bg-card p-10 rounded-[2rem] border border-border shadow-xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight">No orders yet</h1>
          <p className="relative text-base text-foreground/60 mb-10 leading-relaxed">You haven&apos;t placed any orders from this device.</p>
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-4">Order History</h1>
        <p className="text-lg text-foreground/60 mb-10">
          Showing orders saved locally on this device. (Frontend Integration Phase)
        </p>

        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-card rounded-[1.5rem] border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                aria-expanded={expandedIndex === idx}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedIndex(expandedIndex === idx ? null : idx);
                  }
                }}
              >
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-xl font-bold text-foreground">
                      {order.date ? new Date(order.date).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : "Recent Order"}
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-green-100/50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-600/20">
                      Prepared
                    </span>
                  </div>
                  <p className="text-base text-foreground/60 font-medium">
                    {order.summary.totalItems} items • <span className="font-bold text-foreground">₹{order.summary.totalPrice}</span> • {order.customer.name}
                  </p>
                </div>
                
                <div className="flex items-center text-foreground/40 group">
                  <span className="text-sm font-bold mr-3 group-hover:text-primary transition-colors">{expandedIndex === idx ? "Hide Details" : "View Details"}</span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {expandedIndex === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {expandedIndex === idx && (
                <div className="border-t border-border bg-stone-50/50 p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground/40 uppercase tracking-widest mb-5">Customer Details</h3>
                      <dl className="space-y-4 text-base">
                        <div className="flex justify-between border-b border-border pb-3">
                          <dt className="text-foreground/60 font-medium">Name:</dt>
                          <dd className="font-bold text-foreground">{order.customer.name}</dd>
                        </div>
                        <div className="flex justify-between border-b border-border pb-3">
                          <dt className="text-foreground/60 font-medium">Phone:</dt>
                          <dd className="font-bold text-foreground">{order.customer.phone}</dd>
                        </div>
                        {order.customer.notes && (
                          <div className="flex justify-between border-b border-border pb-3">
                            <dt className="text-foreground/60 font-medium shrink-0 mr-4">Notes:</dt>
                            <dd className="font-medium text-foreground italic text-right">{order.customer.notes}</dd>
                          </div>
                        )}
                        {order.date && (
                          <div className="flex justify-between pb-3">
                            <dt className="text-foreground/60 font-medium">Placed:</dt>
                            <dd className="font-bold text-foreground">
                              {new Date(order.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-foreground/40 uppercase tracking-widest mb-5">Order Items</h3>
                      <ul className="space-y-5">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between items-start text-base border-b border-border/50 pb-4 last:border-0 last:pb-0">
                            <div className="pr-4">
                              <p className="font-bold text-foreground">{item.quantity} × {item.name}</p>
                              {item.option && (
                                <p className="inline-block px-2 py-0.5 mt-1.5 rounded bg-primary/10 text-[11px] font-bold text-primary">
                                  + {item.option}
                                </p>
                              )}
                              <p className="text-sm font-medium text-foreground/60 mt-1.5">₹{item.unitPrice} each</p>
                            </div>
                            <div className="font-extrabold text-foreground shrink-0 tracking-tight">
                              ₹{item.lineTotal}
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 pt-5 border-t-2 border-border flex justify-between items-center text-base">
                        <span className="font-bold text-foreground">Subtotal</span>
                        <span className="text-xl font-extrabold text-foreground tracking-tight">₹{order.summary.totalPrice}</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
