"use client";

import React, { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Button from './Button';
import Link from 'next/link';

const FlashSales = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 border-b pb-16">
        <div className='mt-20'>
          <SectionHeading
            subHeading={"today's"}
            heading={"Flash Sales"}
            countDown={true}
            navigationButtons={
              <div className="flex items-center gap-2">
                <button className="flash-prev w-10 h-10 rounded-full bg-[#F5F5F5] cursor-pointer hover:text-white hover:bg-primary transition-all flex items-center justify-center">
                  <FaArrowLeft />
                </button>
                <button className="flash-next w-10 h-10 rounded-full bg-[#F5F5F5] cursor-pointer hover:text-white hover:bg-primary transition-all flex items-center justify-center">
                  <FaArrowRight />
                </button>
              </div>
            }
          />

          <div className='mt-10 w-full'>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              navigation={{ prevEl: '.flash-prev', nextEl: '.flash-next' }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="!overflow-hidden"
            >
              {products.slice(0, 8).map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className='text-center mt-8'>
            <Button TagName={Link} href={"/products"}>View All Products</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSales;