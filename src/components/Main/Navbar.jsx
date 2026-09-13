'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useDrawerStore } from '@/store/useDrawerStore';
import logo from "./../../../public/navbarLogo.png";
import wishlistIcon from "../../assets/icons/wishlist.svg";
import cartIcon from "../../assets/icons/cart.png";
import { FiUser, FiLogOut } from "react-icons/fi";
import { toast } from 'react-toastify';
import { RiUser3Line } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import MenuSection from './MenuSection';

const Navbar = () => {
    const router = useRouter();
    const cart = useCartStore((state) => state.cart);
    const wishlist = useWishlistStore((state) => state.wishlist);
    const openDrawer = useDrawerStore((state) => state.openDrawer);

    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // User state
    const [user, setUser] = useState(null);

    const dropdownRef = useRef(null);

    // ইউজার ডেটা লোড করার জন্য ফাংশন
    const checkUserSession = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userProfilePic = parsedUser.picture || parsedUser.avatar || parsedUser.image;
                setUser({
                    ...parsedUser,
                    picture: userProfilePic
                });
            } catch (error) {
                console.error("Failed to parse user data", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        checkUserSession();

        // লোকালস্টোরেজ বা লগইন পরিবর্তনের সাথে সাথে স্টেট সিঙ্ক করার জন্য ইভেন্ট লিসেনার
        const handleStorageChange = () => {
            checkUserSession();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userLogin', handleStorageChange); 
        window.addEventListener('userStateChanged', handleStorageChange); // অতিরিক্ত নিরাপত্তা হিসেবে এটিও যুক্ত করা হলো

        const handleScroll = () => {
            if (window.scrollY > 30) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLogin', handleStorageChange);
            window.removeEventListener('userStateChanged', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            setLoading(true);
            setIsOpen(true);

            fetch(`https://dummyjson.com/products/search?q=${searchQuery}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data.products ? data.products.slice(0, 6) : []);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Search fetch error:", error);
                    setLoading(false);
                });
        } else {
            setSearchResults([]);
            setIsOpen(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        if (user) {
            router.push('/user/profile');
        } else {
            router.push('/login');
        }
    };

    const cartCount = isMounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
    const wishlistCount = isMounted ? wishlist.length : 0;

    const handleLogOut = async () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
            window.dispatchEvent(new Event('userLogin')); // স্টেট আপডেট করার জন্য ইভেন্ট ট্রিগার
            window.dispatchEvent(new Event('userStateChanged')); 
            toast.success("Successfully logged out your account");
            router.push('/login');
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <nav className={`sticky top-0 w-full border-b border-b-[rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-md z-[99] shadow-sm transition-all duration-300 ${isScrolled ? 'py-1.5 md:py-2' : 'py-3 md:py-5'}`}>
            <div className='container mx-auto px-4 md:px-0'>
                <div className={`flex flex-col md:flex-row items-center justify-between transition-all duration-300 ${isScrolled ? 'gap-0' : 'gap-4'} md:gap-8`}>

                    <div className="relative flex items-center justify-between w-full px-1 mr-1 md:w-auto min-h-[45px] md:min-h-0">
                        <button
                            onClick={openDrawer}
                            className="block lg:hidden text-black p-1 hover:bg-gray-100 rounded-md transition-colors z-10"
                        >
                            <RxHamburgerMenu size={26} />
                        </button>
                        <Link
                            href={"/"}
                            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex-shrink-0 z-10"
                        >
                            <div className='flex items-center gap-2'>
                                <Image
                                    src={logo}
                                    height={90}
                                    width={180}
                                    alt='logo'
                                    className="h-[38px] w-auto md:h-auto object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                        <div className="flex items-center gap-4 md:hidden z-10">
                            <Link href={"/cart"} className='relative p-1'>
                                <Image src={cartIcon} height={22} width={22} alt="cart" />
                                <span className='absolute -top-1 -right-1 bg-[#eb6e1b] text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center'>
                                    {cartCount}
                                </span>
                            </Link>
                        </div>
                    </div>

                    <div
                        ref={dropdownRef}
                        className={`relative w-full md:flex-1 px-1 md:max-w-[650px] transition-all duration-300 ${isScrolled ? 'block md:hidden' : 'block'}`}
                    >
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length > 1 && setIsOpen(true)}
                                placeholder="Search for product..."
                                className="w-full bg-[#F5F5F5] text-xs md:text-sm text-black pl-4 pr-10 py-2.5 md:py-3 rounded-xl focus:outline-[#FFAD33] placeholder:text-[rgba(0,0,0,0.5)] placeholder:font-semibold font-poppins border-2"
                            />
                            <button
                                type="submit"
                                className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-[#eb6e1b] text-white hover:bg-black font-bold p-1.5 md:p-2 rounded-full transition-colors"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {isOpen && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white text-black border border-gray-200 rounded-xl shadow-2xl z-[9999] overflow-hidden max-h-[400px] flex flex-col">
                                {loading ? (
                                    <div className="p-5 text-center text-sm text-gray-500 font-poppins">Searching products...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 p-2 overflow-y-auto">
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 p-2 bg-white hover:bg-gray-50 transition-colors rounded-lg group"
                                                >
                                                    <div className="w-10 h-10 relative flex-shrink-0 bg-[#F5F5F5] rounded-md overflow-hidden flex items-center justify-center">
                                                        <Image src={product.thumbnail} height={100} width={100} alt={product.title} className="object-contain max-w-full max-h-full" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-[#ff6308] transition-colors font-poppins">
                                                            {product.title}
                                                        </span>
                                                        <span className="text-xs text-[#ff6308] font-bold mt-0.5">৳ {product.price}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleSearchSubmit}
                                            className="w-full text-center py-2.5 bg-gray-50 border-t text-xs font-bold text-gray-700 hover:text-white hover:bg-[#ff6308] transition-all font-poppins cursor-pointer"
                                        >
                                            View All Results ({searchQuery})
                                        </button>
                                    </>
                                ) : (
                                    <div className="p-5 text-center text-sm text-gray-500 font-poppins">
                                        No products found for &quot;{searchQuery}&quot;
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {isScrolled && (
                        <div className="hidden md:flex items-center justify-center flex-1">
                            <MenuSection />
                        </div>
                    )}

                    <div className='hidden md:flex items-center gap-6 lg:gap-8 text-black flex-shrink-0'>
                        <Link href={"/wishlist"} className='cursor-pointer relative group'>
                            <Image src={wishlistIcon} height={24} width={24} alt="wishlist" />
                            <span className='absolute -top-3 -right-3 bg-[#eb6e1b] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center'>
                                {wishlistCount}
                            </span>
                        </Link>

                        <Link href={"/cart"} className='cursor-pointer relative group'>
                            <Image src={cartIcon} height={25} width={25} alt="cart" />
                            <span className='absolute -top-3 -right-3 bg-[#eb6e1b] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center'>
                                {cartCount}
                            </span>
                        </Link>

                        <div className='relative group pt-2 pb-2 -my-2'>
                            <button 
                                onClick={handleProfileClick} 
                                className='cursor-pointer flex items-center justify-center rounded-full hover:bg-[#eb6e1b] hover:text-white transition-all border overflow-hidden w-10 h-10 bg-gray-100 text-black font-bold'
                            >
                                {user?.picture ? (
                                    <Image 
                                        src={user.picture} 
                                        alt="User Photo" 
                                        width={40} 
                                        height={40} 
                                        className="rounded-full object-cover w-full h-full"
                                    />
                                ) : user?.name ? (
                                    <span className="text-sm font-semibold uppercase">
                                        {user.name.charAt(0)}
                                    </span>
                                ) : (
                                    <RiUser3Line size={22} />
                                )}
                            </button>

                            {user && (
                                <div className='absolute right-0 top-10 mt-1 w-64 bg-black/80 backdrop-blur-md text-white rounded-lg p-4 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-[999] flex flex-col gap-3'>
                                    <div className="px-2 py-1 border-b border-white/10 text-xs text-gray-300">
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="truncate">{user.email}</p>
                                    </div>
                                    <Link href={"/user/profile"} className='flex items-center gap-3 py-1.5 px-2 hover:bg-white/10 rounded-md transition-colors text-sm font-light cursor-pointer'>
                                        <FiUser size={20} />
                                        <span>Manage My Account</span>
                                    </Link>
                                    <button onClick={handleLogOut} className='flex items-center gap-3 py-1.5 px-2 hover:bg-white/10 rounded-md transition-colors text-sm font-light w-full text-left cursor-pointer'>
                                        <FiLogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;