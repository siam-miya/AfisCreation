"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewArrivalsProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/products`);
        const result = await res.json();
        
        let productsArray = [];
        if (result.success && result.data) {
           productsArray = result.data;
        } else if (Array.isArray(result)) {
           productsArray = result;
        }

        setProducts(productsArray);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading || products.length < 4) {
    return null; // পর্যাপ্ত প্রোডাক্ট না থাকলে রেন্ডার হবে না
  }

  // লেটেস্ট ৪টি প্রোডাক্ট নেওয়া হলো (ব্যাকএন্ড থেকে সর্ট হয়ে আসায় প্রথম ৪টিই সবচেয়ে নতুন)
  const p1 = products[0];
  const p2 = products[1];
  const p3 = products[2];
  const p4 = products[3];

  return (
    <div className="bg-white py-6 md:py-12 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[280px]">
        
        {/* First Large Product */}
        <div className="relative bg-black rounded-xl overflow-hidden flex flex-col justify-end p-4 md:p-6 col-span-2 row-span-2 group">
          <div className="absolute inset-0 w-full h-full z-0 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={p1.thumbnail}
              alt={p1.title}
              fill
              className="object-contain object-bottom p-4 opacity-90"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

          <div className="relative z-20 text-white max-w-[90%] md:max-w-[80%]">
            <h3 className="text-lg md:text-xl font-bold tracking-wide font-inter truncate leading-tight">
              {p1.title}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm mt-1.5 font-light hidden sm:line-clamp-2 font-poppins">
              {p1.description}
            </p>
            <Link
              href={`/products/${p1._id || p1.id}`}
              className="inline-block mt-3 text-xs md:text-sm font-medium underline underline-offset-4 hover:text-secondary transition-colors font-inter"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Second Product */}
        <div className="relative bg-black rounded-xl overflow-hidden flex flex-col justify-end p-4 md:p-6 col-span-2 row-span-1 group">
          <div className="absolute inset-0 w-full h-full z-0 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={p2.thumbnail}
              alt={p2.title}
              fill
              className="object-cover object-right opacity-85"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10" />

          <div className="relative z-20 text-white max-w-[75%]">
            <h3 className="text-base md:text-lg font-bold tracking-wide font-inter truncate leading-tight">
              {p2.title}
            </h3>
            <p className="text-gray-300 text-xs mt-1 font-light hidden md:line-clamp-1 font-inter">
              {p2.description}
            </p>
            <Link
              href={`/products/${p2._id || p2.id}`}
              className="inline-block mt-2 text-xs font-medium underline underline-offset-4 hover:text-secondary transition-colors font-inter"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Third Product */}
        <div className="relative bg-black rounded-xl overflow-hidden flex flex-col justify-end p-3 md:p-6 col-span-1 row-span-1 group">
          <div className="absolute inset-0 w-full h-full z-0 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={p3.thumbnail}
              alt={p3.title}
              fill
              className="object-contain object-center p-3 opacity-90"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent z-10" />

          <div className="relative z-20 text-white w-full">
            <h3 className="text-xs sm:text-sm md:text-base font-bold tracking-wide font-inter truncate leading-tight">
              {p3.title}
            </h3>
            <Link
              href={`/products/${p3._id || p3.id}`}
              className="inline-block mt-1 text-[10px] sm:text-xs font-medium underline underline-offset-4 hover:text-secondary transition-colors font-inter"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Fourth Product */}
        <div className="relative bg-black rounded-xl overflow-hidden flex flex-col justify-end p-3 md:p-6 col-span-1 row-span-1 group">
          <div className="absolute inset-0 w-full h-full z-0 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={p4.thumbnail}
              alt={p4.title}
              fill
              className="object-contain object-center p-3 opacity-90"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent z-10" />

          <div className="relative z-20 text-white w-full">
            <h3 className="text-xs sm:text-sm md:text-base font-bold tracking-wide font-inter truncate leading-tight">
              {p4.title}
            </h3>
            <Link
              href={`/products/${p4._id || p4.id}`}
              className="inline-block mt-1 text-[10px] sm:text-xs font-medium underline underline-offset-4 hover:text-secondary transition-colors font-inter"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewArrivalsProducts;