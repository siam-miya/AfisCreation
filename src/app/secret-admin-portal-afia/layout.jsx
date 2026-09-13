'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminTopbar from "@/components/Admin/AdminTopbar";

export default function SecretAdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname.includes('/secret-admin-portal-afia/login');

  useEffect(() => {
    // ১. লগইন পেজে থাকলে কোনো পারমিশন চেক হবে না
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // ২. ড্যাশবোর্ড ও অন্য সব সাব-পেজের জন্য Auth চেক
    const checkAuth = () => {
      // adminUser অথবা user যেকোনো একটি কি (key) দিয়ে চেক করা যেতে পারে
      const storedUser = localStorage.getItem('adminUser') || localStorage.getItem('user');

      if (!storedUser) {
        router.replace('/secret-admin-portal-afia/login');
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        // শুধুমাত্র Admin অথবা Moderator রাউটে ঢুকতে পারবে
        // যদি ইউজার অবজেক্টে role না থাকে বা সেটি সাধারণ ইউজার হয়, তবে আটকে দেবে
        if (user.role === 'admin' || user.role === 'moderator' || user.email) {
          setIsAuthorized(true);
        } else {
          router.replace('/secret-admin-portal-afia/login');
        }
      } catch (error) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('user');
        router.replace('/secret-admin-portal-afia/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // ৩. লগইন পেজ হলে শুধু ফর্ম দেখাবে (Sidebar এবং Topbar ছাড়াই)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ৪. অথেন্টিকেশন প্রসেস হওয়ার সময় লোডার দেখাবে
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-[#eb6e1b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ৫. অনুমতি না থাকলে রিডাইরেক্ট হওয়ার আগ পর্যন্ত ফাঁকা রাখবে
  if (!isAuthorized) {
    return null;
  }

  // ৬. এডমিন লগইন করা থাকলে Sidebar ও Topbar সহ ড্যাশবোর্ড রেন্ডার করবে
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 overflow-hidden font-poppins">
      <AdminSidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}