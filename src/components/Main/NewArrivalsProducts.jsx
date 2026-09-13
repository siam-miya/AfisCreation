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

  if (loading || !products || products.length === 0) {
    return null;
  }

  const p1 = products[0];
  const p2 = products[1];
  const p3 = products[2];
  const p4 = products[3];

  return (
    <div className="bg-white py-6 md:py-12 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[280px]">
        
        {/* First Large Product (Main Featured Card) */}
        {p1 && (
          <div className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-5 md:p-8 col-span-2 row-span-2 group cursor-pointer bg-gray-100 shadow-sm">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                src={p1.thumbnail}
                alt={p1.title || 'Product'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </div>
            {/* Smooth Dark Gradient Scrim for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

            <div className="relative z-20 text-white max-w-[90%]">
              <h3 className="text-xl md:text-2xl font-bold tracking-wide font-inter truncate leading-tight drop-shadow-sm">
                {p1.title}
              </h3>
              {p1.description && (
                <p className="text-gray-200 text-xs md:text-sm mt-2 font-light line-clamp-2 font-poppins opacity-90">
                  {p1.description}
                </p>
              )}
              <Link
                href={`/products/${p1._id || p1.id}`}
                className="inline-flex items-center gap-1.5 mt-4 text-xs md:text-sm font-semibold underline underline-offset-4 hover:text-gray-200 transition-colors font-inter group/btn"
              >
                Shop Now
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Second Product (Wide Card) */}
        {p2 && (
          <div className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-5 md:p-6 col-span-2 row-span-1 group cursor-pointer bg-gray-100 shadow-sm">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                src={p2.thumbnail}
                alt={p2.title || 'Product'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />

            <div className="relative z-20 text-white max-w-[85%]">
              <h3 className="text-lg md:text-xl font-bold tracking-wide font-inter truncate leading-tight drop-shadow-sm">
                {p2.title}
              </h3>
              {p2.description && (
                <p className="text-gray-200 text-xs mt-1.5 font-light line-clamp-1 font-inter opacity-90">
                  {p2.description}
                </p>
              )}
              <Link
                href={`/products/${p2._id || p2.id}`}
                className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold underline underline-offset-4 hover:text-gray-200 transition-colors font-inter group/btn"
              >
                Shop Now
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Third Product (Grid Small Card 1) */}
        {p3 && (
          <div className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-4 md:p-6 col-span-1 row-span-1 group cursor-pointer bg-gray-100 shadow-sm">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                src={p3.thumbnail}
                alt={p3.title || 'Product'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />

            <div className="relative z-20 text-white w-full">
              <h3 className="text-sm md:text-base font-bold tracking-wide font-inter truncate leading-tight drop-shadow-sm">
                {p3.title}
              </h3>
              <Link
                href={`/products/${p3._id || p3.id}`}
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold underline underline-offset-4 hover:text-gray-200 transition-colors font-inter group/btn"
              >
                Shop Now
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Fourth Product (Grid Small Card 2) */}
        {p4 && (
          <div className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-4 md:p-6 col-span-1 row-span-1 group cursor-pointer bg-gray-100 shadow-sm">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                src={p4.thumbnail}
                alt={p4.title || 'Product'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />

            <div className="relative z-20 text-white w-full">
              <h3 className="text-sm md:text-base font-bold tracking-wide font-inter truncate leading-tight drop-shadow-sm">
                {p4.title}
              </h3>
              <Link
                href={`/products/${p4._id || p4.id}`}
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold underline underline-offset-4 hover:text-gray-200 transition-colors font-inter group/btn"
              >
                Shop Now
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewArrivalsProducts;