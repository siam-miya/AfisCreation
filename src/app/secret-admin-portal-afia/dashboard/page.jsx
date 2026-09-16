'use client';

import React from 'react';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiPlus, FiEye } from 'react-icons/fi';

const AdminDashboardPage = () => {
  // ডায়নামিক ডাটা ব্যাকএন্ড API থেকে আসার আগ পর্যন্ত ডামি ডাটা
  const stats = [
    { id: 1, title: 'Total Revenue', value: '৳ 45,200', icon: FiDollarSign, color: 'bg-emerald-500' },
    { id: 2, title: 'Total Orders', value: '128', icon: FiShoppingBag, color: 'bg-blue-500' },
    { id: 3, title: 'Total Products', value: '45', icon: FiPackage, color: 'bg-indigo-500' },
    { id: 4, title: 'Total Customers', value: '89', icon: FiUsers, color: 'bg-amber-500' },
  ];

  const recentOrders = [
    { id: 'ORD-1001', customer: 'Siam Miya', amount: '৳ 1,200', status: 'Pending', date: '2026-09-13' },
    { id: 'ORD-1000', customer: 'Rahim Ahmed', amount: '৳ 3,500', status: 'Delivered', date: '2026-09-12' },
    { id: 'ORD-0999', customer: 'Karim Ullah', amount: '৳ 850', status: 'Processing', date: '2026-09-12' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-poppins">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products, orders, and store overview.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/secret-admin-portal-afia/dashboard/products/create"
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <FiPlus size={18} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{item.value}</h3>
              </div>
              <div className={`p-3.5 rounded-xl text-white ${item.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-2">{order.customer}</td>
                    <td className="py-3 px-2 font-semibold">{order.amount}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-gray-500 hover:text-primary p-1 inline-block">
                        <FiEye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Management Navigation */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Store Management</h2>
          <div className="space-y-3">
            <Link href="/admin/products" className="block p-3.5 rounded-lg border border-gray-100 hover:border-primary hover:bg-gray-50 transition-all font-medium text-sm text-gray-700">
              📦 All Products List
            </Link>
            <Link href="/admin/products/add" className="block p-3.5 rounded-lg border border-gray-100 hover:border-primary hover:bg-gray-50 transition-all font-medium text-sm text-gray-700">
              ➕ Add New Product
            </Link>
            <Link href="/admin/orders" className="block p-3.5 rounded-lg border border-gray-100 hover:border-primary hover:bg-gray-50 transition-all font-medium text-sm text-gray-700">
              🛒 Manage Orders
            </Link>
            <Link href="/admin/users" className="block p-3.5 rounded-lg border border-gray-100 hover:border-primary hover:bg-gray-50 transition-all font-medium text-sm text-gray-700">
              👥 Users & Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;