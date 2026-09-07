'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Sparkles, 
  Flame, 
  Star, 
  Layers,
  Info,
  Mail 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isProductOpen, setIsProductOpen] = useState(pathname.includes('/dashboard/products'));

  const productSubMenus = [
    { name: 'All Products', href: '/secret-admin-portal-afia/dashboard/products', icon: Layers },
    { name: 'Flash Sales', href: '/secret-admin-portal-afia/dashboard/products/flash-sales', icon: Zap },
    { name: 'New Arrival', href: '/secret-admin-portal-afia/dashboard/products/new-arrival', icon: Sparkles },
    { name: 'Best Selling', href: '/secret-admin-portal-afia/dashboard/products/best-selling', icon: Flame },
    { name: 'Featured', href: '/secret-admin-portal-afia/dashboard/products/featured', icon: Star },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col h-screen p-6 font-poppins overflow-y-auto">
      <div className="text-xl font-bold text-white mb-8 flex items-center gap-2">
        <span className="text-orange-500">Afis</span>Creation
      </div>

      <nav className="space-y-2 flex-1">
        <Link
          href="/secret-admin-portal-afia/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname === '/secret-admin-portal-afia/dashboard'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/secret-admin-portal-afia/dashboard/categories"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname.startsWith('/secret-admin-portal-afia/dashboard/categories')
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <FolderTree size={20} />
          <span>Categories</span>
        </Link>

        {/* Products Dropdown Menu */}
        <div>
          <button
            onClick={() => setIsProductOpen(!isProductOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname.startsWith('/secret-admin-portal-afia/dashboard/products')
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={20} />
              <span>Products</span>
            </div>
            {isProductOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isProductOpen && (
            <div className="pl-4 mt-2 space-y-1 border-l border-slate-700 ml-4">
              {productSubMenus.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isSubActive
                        ? 'text-orange-500 bg-orange-500/10 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <SubIcon size={14} />
                    <span>{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          href="/secret-admin-portal-afia/dashboard/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname.startsWith('/secret-admin-portal-afia/dashboard/orders')
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShoppingCart size={20} />
          <span>Orders</span>
        </Link>

        <Link
          href="/secret-admin-portal-afia/dashboard/users"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname.startsWith('/secret-admin-portal-afia/dashboard/users')
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users size={20} />
          <span>Users</span>
        </Link>

        {/* About Page Menu Item */}
        <Link
          href="/secret-admin-portal-afia/dashboard/about"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname.startsWith('/secret-admin-portal-afia/dashboard/about')
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Info size={20} />
          <span>About Page</span>
        </Link>

        {/* Contact Page Menu Item */}
        <Link
          href="/secret-admin-portal-afia/dashboard/contact"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            pathname.startsWith('/secret-admin-portal-afia/dashboard/contact')
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Mail size={20} />
          <span>Contact Page</span>
        </Link>
      </nav>
    </aside>
  );
}