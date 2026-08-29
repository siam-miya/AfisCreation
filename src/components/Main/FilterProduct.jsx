"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 50000;
const STEP = 100;

const FilterProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentColor = searchParams.get("color") || "all";
  
  const currentMinPrice = parseInt(searchParams.get("minPrice") || MIN_PRICE_LIMIT, 10);
  const currentMaxPrice = parseInt(searchParams.get("maxPrice") || MAX_PRICE_LIMIT, 10);

  const [priceValues, setPriceValues] = useState([currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    setPriceValues([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  const categories = [
    { slug: "all", name: "All Categories" },
    { slug: "beauty", name: "Beauty & Makeup" },
    { slug: "fragrances", name: "Fragrances" },
    { slug: "furniture", name: "Fashion Accessories" },
    { slug: "groceries", name: "New Arrivals" },
  ];

  const colors = [
    { name: "All", value: "all", bgClass: "bg-gray-200" },
    { name: "Red", value: "red", bgClass: "bg-red-500" },
    { name: "Blue", value: "blue", bgClass: "bg-blue-500" },
    { name: "Black", value: "black", bgClass: "bg-gray-900" },
    { name: "White", value: "white", bgClass: "bg-white border border-gray-300" },
    { name: "Green", value: "green", bgClass: "bg-green-500" },
  ];

  const handleCategoryChange = (categorySlug) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === "all") {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleColorChange = (colorValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (colorValue === "all") {
      params.delete("color");
    } else {
      params.set("color", colorValue);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePriceFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceValues[0].toString());
    params.set("maxPrice", priceValues[1].toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setPriceValues([MIN_PRICE_LIMIT, MAX_PRICE_LIMIT]);
    router.push("/products", { scroll: false });
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 tracking-tight">Filters</h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Categories Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs">Categories</h4>
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => handleCategoryChange(cat.slug)}
                className={`text-sm text-left w-full py-2 px-3 rounded-xl transition-all font-medium flex items-center justify-between cursor-pointer ${
                  currentCategory === cat.slug
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Color Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs">Filter by Color</h4>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => handleColorChange(c.value)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                currentColor === c.value
                  ? "border-black bg-gray-50 text-black font-semibold ring-1 ring-black"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 ${c.bgClass}`} />
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 3. Price Range Slider Filter */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs">Filter By Price</h4>
        
        <div className="px-2 pt-2">
          <Range
            values={priceValues}
            step={STEP}
            min={MIN_PRICE_LIMIT}
            max={MAX_PRICE_LIMIT}
            onChange={(values) => setPriceValues(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                }}
                className="w-full h-2 bg-gray-200 rounded-md cursor-pointer relative"
              >
                <div
                  ref={props.ref}
                  className="h-full bg-[#8a5830] rounded-md absolute"
                  style={{
                    left: `${((priceValues[0] - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * 100}%`,
                    right: `${100 - ((priceValues[1] - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  className="w-5 h-5 bg-[#8a5830] rounded-full shadow-md focus:outline-none flex items-center justify-center cursor-pointer border-2 border-white"
                  style={{
                    ...restProps.style,
                  }}
                />
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm">
          <span className="text-gray-500 font-medium">Price:</span>
          <div className="font-sans font-bold text-gray-900">
            <span>{priceValues[0].toLocaleString()}৳</span>
            <span className="text-gray-400 mx-1.5 font-normal">—</span>
            <span>{priceValues[1].toLocaleString()}৳</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePriceFilterSubmit}
          className="w-full bg-[#8a5830] text-white py-2.5 text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-sm cursor-pointer"
        >
          Apply Price Filter
        </button>
      </div>
    </div>
  );
};

export default FilterProduct;