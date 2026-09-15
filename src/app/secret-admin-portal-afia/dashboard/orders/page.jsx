'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Spinner } from '@heroui/react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/orders`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner color="danger" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Customer Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-sm text-gray-700">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer Info</th>
                <th className="p-3">Products & Customization</th>
                <th className="p-3">Shipping</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-semibold text-amber-700">{order.orderId}</td>
                  <td className="p-3">
                    <p className="font-semibold">{order.fullName}</p>
                    <p className="text-gray-500">{order.phoneNumber}</p>
                    <p className="text-xs text-gray-400 max-w-xs">{order.streetAddress}</p>
                    {order.orderNotes && <p className="text-xs italic text-blue-600 mt-1">Note: {order.orderNotes}</p>}
                  </td>
                  <td className="p-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {order.cart.map((item, idx) => (
                        <div key={item.cartItemId || idx} className="flex items-start gap-2 border-b pb-2 last:border-none last:pb-0">
                          <div className="w-10 h-10 relative bg-gray-50 border rounded shrink-0 mt-0.5">
                            <Image src={item.thumbnail || '/placeholder.png'} alt={item.title || 'Product'} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-xs">{item.title} (x{item.quantity})</p>
                            <p className="text-[10px] text-gray-500">৳{item.price} each</p>
                            
                            {/* কালার এবং সাইজ/কাস্টমাইজড ইনফো */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.selectedColor && (
                                <span className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 font-medium">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                            </div>

                            {/* প্রোডাক্ট স্পেসিফিক নোট থাকলে তা দেখাবে */}
                            {item.productNote && (
                              <p className="text-[10px] italic text-indigo-600 mt-0.5">
                                Note: {item.productNote}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-xs">
                    <span className="capitalize">{order.shippingMethod}</span>
                    <p className="text-gray-500">৳{order.shippingCharge}</p>
                  </td>
                  <td className="p-3 font-bold text-gray-900">৳{order.totalCost}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;