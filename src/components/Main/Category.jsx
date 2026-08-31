"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SectionHeading from './SectionHeading';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import CategoryCard from './CategoryCard';
import axios from 'axios';

const Category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড থেকে রিয়েল ক্যাটাগরি ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/categories/all');
        if (res.data.success) {
          // "All Categories" অপشنটি শুরুতে রেখে বাকিগুলো যুক্ত করা হলো
          const formattedCategories = [
            { name: "All Categories", slug: "all", icon: null },
            ...res.data.data.map(cat => ({
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
              icon: `http://localhost:5000${cat.icon}` // ব্যাকএন্ডের ইমেজ পাথ
            }))
          ];
          setCategoryData(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  if (loading) return null; // অথবা লোডিং স্পিনার দিতে পারেন

  return (
    <section className="mb-4 sm:mb-8 md:mb-10 w-full overflow-hidden">
      <div className="container px-4 md:px-0 border-b pb-4 sm:pb-8 md:pb-12">
        <div className="mt-10 sm:mt-10 md:mt-15">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-3 md:mb-6 md:ml-22">
            <SectionHeading subHeading={"Categories"} heading={"Browse By Category"} countDown={false} />
            <div className="flex gap-2 justify-end">
              <button
                ref={(node) => setPrevEl(node)}
                className="bg-[#F5F5F5] hover:bg-[#8a5830] hover:text-white text-black p-2 md:p-3 rounded-full transition-all disabled:opacity-50 cursor-pointer"
              >
                <FaArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                ref={(node) => setNextEl(node)}
                className="bg-[#F5F5F5] hover:bg-[#8a5830] hover:text-white text-black p-2 md:p-3 rounded-full transition-all disabled:opacity-50 cursor-pointer"
              >
                <FaArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 sm:mt-6 md:mt-10 mb-2 sm:mb-6 md:mb-[51px]">
            {prevEl && nextEl && categoryData.length > 0 && (
              <Swiper
                modules={[Navigation]}
                spaceBetween={32}
                slidesPerView={5}
                navigation={{
                  prevEl: prevEl,
                  nextEl: nextEl,
                }}
                breakpoints={{
                  320: { slidesPerView: 2.2, spaceBetween: 12 },
                  480: { slidesPerView: 3, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 24 },
                  1024: { slidesPerView: 5, spaceBetween: 32 },
                }}
                className="mySwiper !overflow-visible md:!overflow-hidden"
              >
                {categoryData.map((category, index) => {
                  const isActive = currentCategory === category.slug || (category.slug === "all" && !searchParams.get("category"));
                  
                  return (
                    <SwiperSlide key={index}>
                      <div onClick={() => handleCategoryClick(category.slug)} className="cursor-pointer">
                        <CategoryCard 
                          icon={category.icon} 
                          text={category.name} 
                          isActive={isActive}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;