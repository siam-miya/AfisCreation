"use client";
import React, { useState, useEffect, useRef } from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowUp, MdHelpOutline } from "react-icons/md"
import MenuSection from "./MenuSection"
import Link from "next/link"
import Image from 'next/image'
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx"
import { usePathname, useRouter } from 'next/navigation'
import { useDrawerStore } from '@/store/useDrawerStore'
import logo from "../../../public/navbarLogo.png"
import wishlistIcon from "../../assets/icons/wishlist.svg"
import cartIcon from "../../assets/icons/cart.png"
import { RiUser3Line } from 'react-icons/ri'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { FiUser, FiLogOut, FiHeart } from "react-icons/fi"
import { toast } from 'react-toastify'
import { Spinner } from '@heroui/react';
import { AiOutlineHome, AiOutlineAppstore, AiOutlineUser, AiOutlineInfoCircle } from "react-icons/ai"
import { FaShoppingBag } from "react-icons/fa";
import { TbTruckDelivery } from 'react-icons/tb';
import axios from 'axios';

const MenuBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const cart = useCartStore((state) => state.cart);
    const wishlist = useWishlistStore((state) => state.wishlist);
    const { isDrawerOpen, closeDrawer, toggleDrawer } = useDrawerStore();

    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const drawerRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);

        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/categories/all');
                if (res.data.success) {
                    setCategories(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories from backend:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();

        const handleScroll = () => {
            if (window.scrollY > 120) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                closeDrawer();
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (pathname !== '/') {
                    setIsDropdownOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDrawer, pathname]);

    const cartCount = isMounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
    const wishlistCount = isMounted ? wishlist.length : 0;

    const handleLogOut = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userStateChanged'));
        toast.success("Successfully logged out your account");
        router.push('/login');
    };

    const handleOrderTrackClick = (e) => {
        const user = localStorage.getItem('user');
        if (!user) {
            e.preventDefault();
            toast.error("Please sign in to track your order!");
            router.push('/signup');
        }
    };

    return (
        <>
            <section className="hidden lg:block bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 md:px-0">
                    <div className={`flex items-center justify-between relative transition-all duration-300 ${isScrolled ? "py-2.5" : ""}`}>
                        <div className="w-[220px] lg:w-[270px] flex-shrink-0 flex items-center">
                            {!isScrolled ? (
                                <div className="w-full z-50 relative self-start" ref={dropdownRef}>
                                    <h2 
                                        onClick={() => setIsDropdownOpen(prev => !prev)}
                                        className="bg-primary text-white py-3.5 px-4 flex items-center justify-between gap-2 font-bold text-sm select-none cursor-pointer rounded-t-md"
                                    >
                                        <span className="flex items-center gap-2 font-poppins">
                                            <RxHamburgerMenu size={18} />
                                            Browse Categories
                                        </span>
                                        <span>
                                            {isDropdownOpen ? (
                                                <MdOutlineKeyboardArrowUp size={20} />
                                            ) : (
                                                <MdOutlineKeyboardArrowDown size={20} />
                                            )}
                                        </span>
                                    </h2>

                                    {/* ক্যাটাগরি মেইন ড্রপডাউন বক্স - overflow কাটার সমস্যা দূর করা হয়েছে */}
                                    <ul className={`w-full bg-white border border-gray-200 shadow-xl p-2 flex flex-col transition-all duration-200 rounded-b-md absolute left-0 top-[48px] z-[999] overflow-visible ${isDropdownOpen ? 'flex' : 'hidden'}`}>
                                        {loading ? (
                                            <div className="flex flex-col items-center py-5 gap-2">
                                                <Spinner size="md" color="danger" />
                                                <span className="text-xs text-black font-bold">Categories Loading....</span>
                                            </div>
                                        ) : (
                                            categories.map((cat, index) => (
                                                <CategoryListItem
                                                    key={cat._id || index}
                                                    category={cat}
                                                    onClick={() => {
                                                        if (pathname !== '/') setIsDropdownOpen(false);
                                                    }}
                                                />
                                            ))
                                        )}
                                    </ul>
                                </div>
                            ) : (
                                <Link href={"/"} className="flex items-center gap-2 animate-fadeIn">
                                    <Image className='object-contain h-[38px] w-auto' src={logo} height={40} width={150} alt='logo' priority />
                                </Link>
                            )}
                        </div>
                        <div className="flex-1 flex justify-center">
                            <MenuSection />
                        </div>

                        <div className="flex-shrink-0 min-w-[120px] flex justify-end items-center">
                            {!isScrolled ? (
                                <Link href={"/order/ordertrack"} onClick={handleOrderTrackClick}>
                                    <button className="text-white font-bold text-sm hover:bg-secondary transition-colors cursor-pointer py-2.5 px-5 bg-primary rounded-md animate-fadeIn font-poppins">
                                        Order Track
                                    </button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-6 text-black animate-fadeIn relative z-[999]">
                                    <Link href={"/wishlist"} className='cursor-pointer relative group'>
                                        <Image src={wishlistIcon} height={22} width={22} alt="wishlist" />
                                        <span className='absolute -top-2.5 -right-2 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                                            {wishlistCount}
                                        </span>
                                    </Link>

                                    <Link href={"/cart"} className='cursor-pointer relative group'>
                                        <Image src={cartIcon} height={23} width={23} alt="cart" />
                                        <span className='absolute -top-2.5 -right-2 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                                            {cartCount}
                                        </span>
                                    </Link>

                                    <div className='relative group pt-2 pb-2 -my-2'>
                                        <Link href={"/user/profile"} className='cursor-pointer block rounded-full hover:bg-primary hover:text-white transition-all p-1.5 border'>
                                            <RiUser3Line size={18} />
                                        </Link>
                                        <div className='absolute right-0 top-full mt-2 w-64 bg-black/80 backdrop-blur-md text-white rounded-lg p-4 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-[999] flex flex-col gap-3'>
                                            <Link href={"/user/profile"} className='flex items-center gap-3 py-1.5 px-2 hover:bg-white/10 rounded-md transition-colors text-sm font-light cursor-pointer'>
                                                <FiUser size={18} />
                                                <span>Manage My Account</span>
                                            </Link>
                                            <button onClick={handleLogOut} className='flex items-center gap-3 py-1.5 px-2 hover:bg-white/10 rounded-md transition-colors text-sm font-light w-full text-left cursor-pointer'>
                                                <FiLogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default MenuBar

// সাব-ক্যাটাগরি আইটেম কম্পোনেন্ট যেখানে পজিশন বাইরে নিয়ে আসার ব্যবস্থা করা হয়েছে
function CategoryListItem({ category, onClick }) {
    const [imgError, setImgError] = useState(false);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const categoryIcon = category.icon ? `http://localhost:5000${category.icon}` : null;
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <li className="w-full text-black hover:bg-gray-50 rounded-xl transition-all relative group/item">
            <Link
                href={`/products?category=${slug}`}
                onClick={onClick}
                className='grid grid-cols-[24px_1fr_24px] gap-2 items-center py-2.5 px-3'
            >
                <span className="flex items-center justify-center text-gray-500">
                    {categoryIcon && !imgError ? (
                        <img 
                            src={categoryIcon} 
                            alt={category.name} 
                            className="w-5 h-5 object-cover rounded-sm" 
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <FaShoppingBag size={16} className="text-gray-400" />
                    )}
                </span>
                <span className='text-xs sm:text-sm capitalize font-poppins font-medium text-gray-700'>{category.name}</span>
                
                {hasSubcategories ? (
                    <MdOutlineKeyboardArrowRight size={18} className="text-gray-400 justify-self-end" />
                ) : (
                    <span></span>
                )}
            </Link>

            {/* সাব-ক্যাটাগরি পপআপ যা মেইন ড্রপডাউনের ডানপাশে পুরোপুরি বাইরে ভেসে থাকবে */}
            {hasSubcategories && (
                <div className="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-200 shadow-2xl rounded-md p-2 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 z-[99999] flex flex-col gap-1">
                    {category.subcategories.map((sub) => {
                        const subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-');
                        return (
                            <Link
                                key={sub._id || sub.name}
                                href={`/products?category=${subSlug}`}
                                onClick={onClick}
                                className="py-2 px-3 text-xs sm:text-sm text-gray-700 hover:bg-primary hover:text-white rounded-md transition-colors font-poppins"
                            >
                                {sub.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </li>
    );
}