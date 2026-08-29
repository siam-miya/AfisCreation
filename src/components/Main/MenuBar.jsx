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
import { BiLaptop } from "react-icons/bi";
import { AiOutlineHome, AiOutlineAppstore, AiOutlineUser, AiOutlineInfoCircle } from "react-icons/ai"
import {
    FaCar, FaClock, FaHome, FaMobileAlt, FaMotorcycle,
    FaRedhat, FaRunning, FaShoppingBag, FaTshirt
} from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import {
    GiBigDiamondRing, GiDelicatePerfume, GiFootprint,
    Gi3dGlasses, GiLipstick, GiTable
} from "react-icons/gi";
import { MdChair, MdOutlineFastfood } from "react-icons/md";
import { TbTruckDelivery } from 'react-icons/tb';

const categoryIcons = {
    "beauty": <GiLipstick size={18} />,
    "fragrances": <GiDelicatePerfume size={18} />,
    "furniture": <MdChair size={18} />,
    "groceries": <MdOutlineFastfood size={18} />,
    "home-decoration": <FaHome size={18} />,
    "kitchen-accessories": <GiTable size={18} />,
    "laptops": <BiLaptop size={18} />,
    "mens-shirts": <FaUserTie size={18} />,
    "mens-shoes": <GiFootprint size={18} />,
    "mens-watches": <FaClock size={18} />,
    "mobile-accessories": <FaMobileAlt size={18} />,
    "motorcycle": <FaMotorcycle size={18} />,
    "skin-care": <GiLipstick size={18} />,
    "smartphones": <FaMobileAlt size={18} />,
    "sports-accessories": <FaRunning size={18} />,
    "sunglasses": <Gi3dGlasses size={18} />,
    "tops": <FaTshirt size={18} />,
    "vehicle": <FaCar size={18} />,
    "womens-bags": <FaShoppingBag size={18} />,
    "womens-dresses": <FaRedhat size={18} />,
    "womens-jewellery": <GiBigDiamondRing size={18} />,
    "womens-shoes": <GiFootprint size={18} />,
    "womens-watches": <FaClock size={18} />,
};

const MenuBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isHomePage = pathname === '/';
    const cart = useCartStore((state) => state.cart);
    const wishlist = useWishlistStore((state) => state.wishlist);
    const { isDrawerOpen, closeDrawer, toggleDrawer } = useDrawerStore();

    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Dropdown state for click-based toggle on all pages
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const drawerRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);

        const fetchCategories = async () => {
            try {
                const res = await fetch('https://dummyjson.com/products/categories');
                const data = await res.json();
                setCategories(data.slice(0, 11));
            } catch (error) {
                console.error("Failed to fetch categories:", error);
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

    // Close dropdown or drawer when clicking outside
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

    // Check auth for Order Track
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
                                <div className="w-full z-20 relative self-start" ref={dropdownRef}>
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

                                    <ul className={`w-full bg-white border border-gray-200 shadow-lg p-2 flex flex-col transition-all duration-200 rounded-b-md absolute left-0 top-[48px] z-[999] max-h-[450px] overflow-y-auto scrollbar-none ${isDropdownOpen ? 'flex' : 'hidden'}`}>
                                        {loading ? (
                                            <div className="flex flex-col items-center py-5 gap-2">
                                                <Spinner size="md" color="danger" />
                                                <span className="text-xs text-black font-bold">Categories Loading....</span>
                                            </div>
                                        ) : (
                                            categories.map((cat, index) => (
                                                <ListItems
                                                    key={index}
                                                    text={cat.name}
                                                    slug={cat.slug}
                                                    categoryIcon={categoryIcons[cat.slug] || <FaShoppingBag size={18} />}
                                                    rightIcon={true}
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

            <div className={`fixed inset-0 bg-black/60 z-[99999] transition-opacity duration-300 lg:hidden ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div ref={drawerRef} className={`fixed top-0 left-0 bottom-0 w-[290px] bg-[#F7F7F7] z-[999999] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>

                    <div className="p-4 bg-white relative">
                        <button onClick={closeDrawer} className="absolute right-4 top-4 text-gray-500 hover:text-black p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                            <RxCross2 size={20} />
                        </button>

                        <div className="mt-6 bg-primary rounded-2xl p-4 text-white flex items-center gap-4 shadow-md">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/30">
                                <RiUser3Line size={26} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base font-poppins">Hello there!</h3>
                                <Link href="/signup" onClick={closeDrawer} className="text-xs text-white/90 underline hover:text-white">Signin</Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2">
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                            <ul className="flex flex-col divide-y divide-gray-50">
                                {loading ? (
                                    <div className="flex flex-col items-center py-10 gap-2">
                                        <Spinner size="md" color="danger" />
                                        <span className="text-sm text-primary">Categories Loading...</span>
                                    </div>
                                ) : (
                                    categories.map((cat, index) => (
                                        <ListItems
                                            key={index}
                                            text={cat.name}
                                            slug={cat.slug}
                                            categoryIcon={categoryIcons[cat.slug] || <FaShoppingBag size={18} />}
                                            rightIcon={true}
                                            onClick={closeDrawer}
                                        />
                                    ))
                                )}
                            </ul>
                        </div>
                        <div className="mt-5 mb-4">
                            <h4 className="text-xs font-bold text-gray-400 px-2 mb-2 tracking-wider">QUICK LINKS</h4>
                            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-col gap-1">
                                <Link href="/about" onClick={closeDrawer} className="flex items-center gap-3 py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-poppins">
                                    <AiOutlineInfoCircle size={18} className="text-gray-500" />
                                    <span>About Us</span>
                                </Link>
                                <Link href="/wishlist" onClick={closeDrawer} className="flex items-center gap-3 py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-poppins">
                                    <FiHeart size={18} className="text-gray-500" />
                                    <span>Wishlists</span>
                                </Link>
                                <Link href="/faq" onClick={closeDrawer} className="flex items-center gap-3 py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-poppins">
                                    <MdHelpOutline size={18} className="text-gray-500" />
                                    <span>Faqs</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-primary text-white grid grid-cols-5 items-center justify-items-center z-[9999] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] font-poppins px-1">
                <Link href="/" className={`flex flex-col items-center justify-center w-full text-center gap-0.5 text-[10px] ${pathname === '/' ? "text-black font-semibold" : ""}`}>
                    <AiOutlineHome size={22} />
                    <span>HOME</span>
                </Link>

                <Link href="/wishlist" className={`flex flex-col items-center justify-center w-full text-center gap-0.5 text-[10px] relative ${pathname === '/wishlist' ? "text-black font-semibold" : ""}`}>
                    <div className="relative flex items-center justify-center">
                        <FiHeart size={22} className={pathname === '/wishlist' ? "text-black" : "text-white"} />
                        <span className="absolute -top-1.5 -right-2 bg-white text-primary font-bold rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center">
                            {wishlistCount}
                        </span>
                    </div>
                    <span>WISHLIST</span>
                </Link>

                <button onClick={toggleDrawer} className="flex flex-col items-center justify-center w-full text-center gap-0.5 text-[10px]">
                    <AiOutlineAppstore size={22} />
                    <span>CATEGORIES</span>
                </button>

                <Link 
                    href="/order/ordertrack" 
                    onClick={handleOrderTrackClick}
                    className={`flex flex-col items-center justify-center w-full text-center gap-0.5 text-[10px] relative ${pathname === '/ordertrack' ? "text-black font-semibold" : ""}`}
                >
                    <div className="relative flex items-center justify-center">
                        <TbTruckDelivery size={22} className={pathname === '/ordertrack' ? "text-black" : "text-white"} />
                    </div>
                    <span className="whitespace-nowrap">ORDER TRACK</span>
                </Link>

                <Link href="/user/profile" className={`flex flex-col items-center justify-center w-full text-center gap-0.5 text-[10px] ${pathname.startsWith('/user') ? "text-black font-semibold" : ""}`}>
                    <AiOutlineUser size={22} />
                    <span>ACCOUNT</span>
                </Link>
            </div>
        </>
    )
}

export default MenuBar

function ListItems({ rightIcon = false, categoryIcon, text, slug, onClick }) {
    return (
        <li className="w-full text-black hover:bg-gray-50 rounded-xl transition-all" onClick={onClick}>
            <Link
                href={`/products?category=${slug}`}
                className='grid grid-cols-[24px_1fr_24px] gap-2 items-center py-2.5 px-3'
            >
                <span className="flex items-center justify-center text-gray-500">{categoryIcon}</span>
                <span className='text-xs sm:text-sm capitalize font-poppins font-medium text-gray-700'>{text}</span>
                {rightIcon && <MdOutlineKeyboardArrowRight size={18} className="text-gray-400" />}
            </Link>
        </li>
    )
}