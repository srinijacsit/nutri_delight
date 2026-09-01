"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Printer, ArrowRight } from "lucide-react";

interface BulkOrderItem {
  productId: string;
  name: string;
  option: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface BulkOrderPayload {
  type: string;
  date: string;
  delivery: {
    date: string;
    time: string;
  };
  customer: {
    name: string;
    phone: string;
    notes: string;
  };
  items: BulkOrderItem[];
  summary: {
    totalItems: number;
    totalPrice: number;
  };
}

export default function BulkSuccessPage() {
  const [order, setOrder] = useState<BulkOrderPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nutridelight-bulk-last-order");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse bulk order", e);
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
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">No Bulk Order Found</h1>
          <p className="text-stone-500 mb-8">We couldn&apos;t find your recent bulk order details.</p>
          <Link
            href="/bulk-order"
            className="flex items-center justify-center w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
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
    <div className="min-h-screen bg-[#FCFBF8] py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8 text-center print:border-none print:shadow-none print:mb-4">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 print:hidden">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">Bulk Order Prepared</h1>
          <p className="text-stone-500 print:hidden">
            Your bulk order details are ready for backend persistence. Review your bill below.
          </p>
        </div>
        
        {/* Bill Preview */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm mb-8 print:border-stone-300 print:shadow-none">
          <div className="text-center mb-10 pb-10 border-b border-stone-200">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-widest uppercase mb-1">Nutri Delight</h2>
            <p className="text-stone-500 font-medium">Bulk Order Estimate</p>
            <p className="text-sm text-stone-400 mt-2">Generated: {new Date(order.date).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Customer Details</h3>
              <p className="text-stone-900 font-bold">{order.customer.name}</p>
              <p className="text-stone-600">{order.customer.phone}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Delivery Schedule</h3>
              <p className="text-stone-900 font-bold">{order.delivery.date}</p>
              <p className="text-stone-600">{order.delivery.time}</p>
            </div>
          </div>

          <table className="w-full text-left text-sm mb-10">
            <thead className="border-b border-stone-200">
              <tr>
                <th className="py-3 font-bold text-stone-900">Item</th>
                <th className="py-3 font-bold text-stone-900 text-center">Qty</th>
                <th className="py-3 font-bold text-stone-900 text-right">Price</th>
                <th className="py-3 font-bold text-stone-900 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4">
                    <p className="font-bold text-stone-900">{item.name}</p>
                    {item.option && <p className="text-xs text-stone-500 mt-0.5">+ {item.option}</p>}
                  </td>
                  <td className="py-4 text-center font-medium text-stone-600">{item.quantity}</td>
                  <td className="py-4 text-right font-medium text-stone-600">₹{item.unitPrice}</td>
                  <td className="py-4 text-right font-bold text-stone-900">₹{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-6 border-t border-stone-200">
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-500">Total Items</span>
                <span className="font-medium text-stone-900">{order.summary.totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold mt-4 pt-4 border-t border-stone-200">
                <span className="text-stone-900">Estimated Total</span>
                <span className="text-stone-900">₹{order.summary.totalPrice}</span>
              </div>
            </div>
          </div>
          
          {order.customer.notes && (
             <div className="mt-10 pt-6 border-t border-stone-100">
               <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Special Instructions</h3>
               <p className="text-sm text-stone-700 italic">{order.customer.notes}</p>
             </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center rounded-full bg-white border border-stone-200 px-6 py-4 text-sm font-bold text-stone-900 shadow-sm hover:bg-stone-50 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 mr-2" />
            Download / Print Bill
          </button>
          <Link
            href="/bulk-order"
            className="flex-1 flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all group"
          >
            Start New Bulk Order
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}
