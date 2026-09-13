'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const AdminTopbar = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ডাইনামিক অ্যাডমিন স্টেট
  const [adminData, setAdminData] = useState({
    name: 'MD Siam Miya',
    role: 'Super Admin',
    avatar: ''
  });

  // লোকালস্টোরেজ থেকে অ্যাডমিন ডেটা লোড করার ফাংশন
  const loadAdminData = () => {
    const stored = localStorage.getItem('adminUser') || localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdminData({
          name: parsed.name || 'Admin',
          role: parsed.role || 'Super Admin',
          avatar: parsed.picture || parsed.avatar || parsed.image || ''
        });
      } catch (err) {
        console.error("Error parsing admin user", err);
      }
    }
  };

  useEffect(() => {
    // থিম চেক
    const isDark = localStorage.getItem('adminTheme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // প্রথমবার ডেটা লোড
    loadAdminData();

    // প্রোফাইল আপডেট হলে ইভেন্ট লিসেন করার জন্য
    const handleUserLoginSync = () => {
      loadAdminData();
    };

    window.addEventListener('userLogin', handleUserLoginSync);
    return () => {
      window.removeEventListener('userLogin', handleUserLoginSync);
    };
  }, []);

  // ড্রপডাউনের বাইরে ক্লিক করলে মেনু বন্ধ হওয়ার হ্যান্ডলার
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
      setDarkMode(true);
    }
  };

  // অ্যাডমিন লগআউট হ্যান্ডলার
  const handleAdminLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('user');
    toast.success("Successfully logged out!");
    router.push('/secret-admin-portal-afia/login');
  };

  // নামের প্রথম অক্ষর দিয়ে শর্টফর্ম তৈরি (যেমন: MD Siam Miya -> MS)
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm transition-colors duration-200">
      
      {/* বামপাশ: পেজ টাইটেল বা ওয়েলকাম মেসেজ */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          Welcome to Admin Dashboard
        </h2>
      </div>

      {/* ডানপাশ: থিম টগল, নোটিফিকেশন এবং প্রোফাইল */}
      <div className="flex items-center gap-4">
        
        {/* ডার্ক/লাইট মোড বাটন */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* নোটিফিকেশন আইকন */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all cursor-pointer relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* অ্যাডমিন প্রোফাইল সেকশন */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {adminData.avatar ? (
              <img 
                src={adminData.avatar} 
                alt="Admin" 
                className="w-9 h-9 rounded-xl object-cover shadow-md border border-orange-500" 
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center shadow-md">
                {getInitials(adminData.name)}
              </div>
            )}
            
            <div className="hidden md:block text-left">
              <h4 className="text-xs font-semibold text-gray-800 dark:text-white">{adminData.name}</h4>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">{adminData.role}</span>
            </div>
            <ChevronDown size={16} className="text-gray-500 dark:text-slate-400 ml-1" />
          </button>

          {/* ড্রপডাউন মেনু */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800 md:hidden">
                <p className="text-xs font-semibold text-gray-800 dark:text-white">{adminData.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-slate-400">{adminData.role}</p>
              </div>
              
              <Link 
                href="/secret-admin-portal-afia/dashboard/profile" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <User size={15} /> My Profile
              </Link>

              <Link 
                href="/secret-admin-portal-afia/dashboard/settings" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <Settings size={15} /> Settings
              </Link>

              <div className="border-t border-gray-100 dark:border-slate-800 my-1"></div>
              
              <button 
                onClick={handleAdminLogout} 
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer text-left"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminTopbar;