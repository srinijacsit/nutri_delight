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
    return <div className="min-h-screen bg-[#FCFBF8]"></div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center p-4 pt-20">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">No Order Found</h1>
          <p className="text-stone-500 mb-8">We couldn&apos;t find your recent order details.</p>
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">Order Prepared</h1>
          <p className="text-stone-500">
            Your order payload is ready for backend integration. We have saved your details locally for review.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Customer Details</h2>
          <dl className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
              <dt className="text-stone-500 font-medium col-span-1">Name</dt>
              <dd className="text-stone-900 font-bold col-span-2">{order.customer.name}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
              <dt className="text-stone-500 font-medium col-span-1">Phone</dt>
              <dd className="text-stone-900 font-bold col-span-2">{order.customer.phone}</dd>
            </div>
            {order.customer.notes && (
              <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                <dt className="text-stone-500 font-medium col-span-1">Notes</dt>
                <dd className="text-stone-900 font-bold col-span-2">{order.customer.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
          <ul className="divide-y divide-stone-100 mb-6 border-b border-stone-100">
            {order.items.map((item, idx) => (
              <li key={idx} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
                  {item.option && (
                    <p className="text-xs font-semibold text-green-700 mt-0.5">
                      + {item.option}
                    </p>
                  )}
                  <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                </div>
                <div className="text-sm font-extrabold text-stone-900 sm:text-right">
                  ₹{item.lineTotal}
                </div>
              </li>
            ))}
          </ul>
          
          <dl className="space-y-4 text-sm text-stone-600">
            <div className="flex justify-between">
              <dt>Total Items</dt>
              <dd className="font-medium text-stone-900">{order.summary.totalItems}</dd>
            </div>
            <div className="flex justify-between pt-4 border-t border-stone-100">
              <dt className="text-base font-bold text-stone-900">Total Paid</dt>
              <dd className="text-lg font-extrabold text-stone-900">₹{order.summary.totalPrice}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/menu"
            className="flex-1 flex items-center justify-center rounded-full bg-stone-100 px-6 py-4 text-sm font-bold text-stone-900 shadow-sm hover:bg-stone-200 active:scale-95 transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center rounded-full bg-stone-900 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-stone-800 active:scale-95 transition-all group"
          >
            View Orders
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
