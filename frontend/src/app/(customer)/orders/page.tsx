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
    return <div className="min-h-screen bg-[#FCFBF8]"></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">No orders yet</h1>
          <p className="text-stone-500 mb-8">You haven&apos;t placed any orders from this device.</p>
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

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">Order History</h1>
        <p className="text-stone-500 mb-8">
          Showing orders saved locally on this device. (Frontend Integration Phase)
        </p>

        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
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
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-stone-900">
                      {order.date ? new Date(order.date).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : "Recent Order"}
                    </h2>
                    <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                      Prepared
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">
                    {order.summary.totalItems} items • ₹{order.summary.totalPrice} • {order.customer.name}
                  </p>
                </div>
                
                <div className="flex items-center text-stone-400">
                  <span className="text-sm font-medium mr-2">{expandedIndex === idx ? "Hide Details" : "View Details"}</span>
                  {expandedIndex === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {expandedIndex === idx && (
                <div className="border-t border-stone-100 bg-stone-50/50 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div>
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Customer Details</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-20 text-stone-500">Name:</dt>
                          <dd className="font-bold text-stone-900">{order.customer.name}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-20 text-stone-500">Phone:</dt>
                          <dd className="font-medium text-stone-900">{order.customer.phone}</dd>
                        </div>
                        {order.customer.notes && (
                          <div className="flex mt-2 pt-2 border-t border-stone-100">
                            <dt className="w-20 text-stone-500">Notes:</dt>
                            <dd className="font-medium text-stone-900 italic">{order.customer.notes}</dd>
                          </div>
                        )}
                        {order.date && (
                          <div className="flex mt-2 pt-2 border-t border-stone-100">
                            <dt className="w-20 text-stone-500">Placed:</dt>
                            <dd className="font-medium text-stone-900">
                              {new Date(order.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Order Items</h3>
                      <ul className="space-y-4">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between items-start text-sm">
                            <div className="pr-4">
                              <p className="font-bold text-stone-900">{item.quantity} × {item.name}</p>
                              {item.option && (
                                <p className="text-xs text-green-700 font-semibold mt-0.5">+ {item.option}</p>
                              )}
                              <p className="text-xs text-stone-500 mt-0.5">₹{item.unitPrice} each</p>
                            </div>
                            <div className="font-extrabold text-stone-900 shrink-0">
                              ₹{item.lineTotal}
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-center text-sm">
                        <span className="font-bold text-stone-900">Subtotal</span>
                        <span className="text-base font-extrabold text-stone-900">₹{order.summary.totalPrice}</span>
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
