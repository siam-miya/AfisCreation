"use client";
import React, { useEffect, useState } from 'react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import ProductCard from './ProductCard';
import Link from 'next/link';

const BestSelling = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <SectionHeading subHeading={"This Month"} heading={"Best Selling Products"} countDown={false} />
          </div>
          <div className="flex justify-end shrink-0">
            <Button TagName={Link} href={"/products"}>View All</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-6 md:mt-10 mb-10">
          {products.slice(7, 11).map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BestSelling;