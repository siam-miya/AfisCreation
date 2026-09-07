"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, ChevronRight, Layers } from "lucide-react";
import { Range } from "react-range";
import axios from "axios";

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 50000;
const STEP = 100;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FilterProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentColor = searchParams.get("color") || "all";
  
  const currentMinPrice = parseInt(searchParams.get("minPrice") || MIN_PRICE_LIMIT, 10);
  const currentMaxPrice = parseInt(searchParams.get("maxPrice") || MAX_PRICE_LIMIT, 10);

  const [priceValues, setPriceValues] = useState([currentMinPrice, currentMaxPrice]);
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    setPriceValues([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/categories/all`);
        if (res.data.success) {
          setCategories(res.data.data);
          
          res.data.data.forEach(cat => {
            const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
            const hasActiveSub = cat.subcategories?.some(sub => {
              const subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-');
              return subSlug === currentCategory;
            });
            if (currentCategory === catSlug || hasActiveSub) {
              setOpenCategories(prev => ({ ...prev, [cat._id || catSlug]: true }));
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch filter categories:", error);
      }
    };
    fetchCategories();
  }, [currentCategory]);

  const colors = [
    { name: "All", value: "all", bgClass: "bg-gray-200" },
    { name: "Red", value: "red", bgClass: "bg-red-500" },
    { name: "Blue", value: "blue", bgClass: "bg-blue-500" },
    { name: "Black", value: "black", bgClass: "bg-gray-900" },
    { name: "White", value: "white", bgClass: "bg-white border border-gray-300" },
    { name: "Green", value: "green", bgClass: "bg-green-500" },
  ];

  const handleCategoryClick = (cat, catSlug) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      setOpenCategories(prev => ({
        ...prev,
        [cat._id || catSlug]: !prev[cat._id || catSlug]
      }));
    }
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", catSlug);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleSubCategoryClick = (subSlug) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", subSlug);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleColorChange = (colorValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (colorValue === "all") {
      params.delete("color");
    } else {
      params.set("color", colorValue);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handlePriceFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceValues[0].toString());
    params.set("maxPrice", priceValues[1].toString());
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setPriceValues([MIN_PRICE_LIMIT, MAX_PRICE_LIMIT]);
    router.push("/products", { scroll: false });
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 tracking-tight flex items-center gap-2">
          <Layers size={18} className="text-[#8a5830]" />
          <span>Filters</span>
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-lg"
        >
          <RotateCcw size={13} />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Categories & Subcategories Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs text-gray-400">Categories</h4>
        <ul className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
          <li>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("category");
                params.set("page", "1");
                router.push(`/products?${params.toString()}`, { scroll: false });
              }}
              className={`text-sm text-left w-full py-2.5 px-3 rounded-xl transition-all font-medium flex items-center justify-between cursor-pointer ${
                currentCategory === "all"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>All Products</span>
              <span className="text-xs opacity-60">Explore</span>
            </button>
          </li>

          {categories.map((cat) => {
            const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
            const isMainActive = currentCategory === catSlug;
            const isOpen = openCategories[cat._id || catSlug];

            return (
              <React.Fragment key={cat._id || catSlug}>
                <li>
                  <button
                    onClick={() => handleCategoryClick(cat, catSlug)}
                    className={`text-sm text-left w-full py-2 px-3 rounded-xl transition-all font-medium flex items-center justify-between cursor-pointer ${
                      isMainActive
                        ? "bg-black text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {cat.icon && (
                        <img 
                          src={cat.icon.startsWith("http") ? cat.icon : `${API_BASE_URL}${cat.icon}`} 
                          alt={cat.name} 
                          className="w-5 h-5 rounded-md object-cover border border-gray-200" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="font-semibold">{cat.name}</span>
                    </div>
                    {cat.subcategories?.length > 0 && (
                      <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90 text-white' : 'text-gray-400'}`} />
                    )}
                  </button>
                </li>

                {cat.subcategories && cat.subcategories.length > 0 && isOpen && (
                  cat.subcategories.map((sub) => {
                    const subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-');
                    const isSubActive = currentCategory === subSlug;

                    return (
                      <li key={sub._id || subSlug} className="pl-4 animate-fadeIn">
                        <button
                          onClick={() => handleSubCategoryClick(subSlug)}
                          className={`text-xs sm:text-sm text-left w-full py-1.5 px-3 rounded-lg transition-all font-normal flex items-center gap-2 cursor-pointer ${
                            isSubActive
                              ? "bg-[#8a5830] text-white shadow-sm font-medium"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                          }`}
                        >
                          <span className="text-gray-400">╰─</span>
                          <span>{sub.name}</span>
                        </button>
                      </li>
                    );
                  })
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Color Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs text-gray-400">Filter by Color</h4>
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
              <span className={`w-3 h-3 rounded-full shrink-0 shadow-sm ${c.bgClass}`} />
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 3. Price Range Slider */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs text-gray-400">Filter By Price</h4>
        
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
                style={{ ...props.style }}
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
            renderThumb={({ props }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  className="w-5 h-5 bg-[#8a5830] rounded-full shadow-md focus:outline-none flex items-center justify-center cursor-pointer border-2 border-white"
                  style={{ ...restProps.style }}
                />
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm">
          <span className="text-gray-500 font-medium">Price Range:</span>
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