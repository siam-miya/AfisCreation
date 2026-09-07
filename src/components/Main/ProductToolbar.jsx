"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Range, getTrackBackground } from "react-range";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 50000;
const STEP = 100; 

const ProductToolbar = ({ totalProducts, currentShowing }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const currentMinPrice = parseInt(searchParams.get("minPrice") || MIN_PRICE_LIMIT, 10);
  const currentMaxPrice = parseInt(searchParams.get("maxPrice") || MAX_PRICE_LIMIT, 10);

  const [priceValues, setPriceValues] = useState([currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    setPriceValues([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);
  
  const currentView = searchParams.get("view") || "4";
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleParamChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePriceFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceValues[0].toString());
    params.set("maxPrice", priceValues[1].toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false); 
  };

  return (
    <div className="bg-black px-4 md:px-6 py-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4 font-poppins text-white mb-6 relative">
      <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto border-b border-gray-800 md:border-b-0 pb-3 md:pb-0">
        <div className="relative" ref={popupRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 font-medium transition-all py-1 px-2 rounded cursor-pointer ${
              isFilterOpen ? "text-primary" : "text-white hover:text-primary"
            }`}
          >
            <SlidersHorizontal size={18} />
            <span className="text-white font-semibold hover:text-primary text-sm md:text-base">Filter</span>
          </button>

          {isFilterOpen && (
            <div className="absolute left-0 mt-3 w-72 sm:w-80 bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100 z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base sm:text-lg text-black font-poppins">Filter By Price</h3>
                <button 
                  onClick={() => setIsFilterOpen(false)} 
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 pt-1 pb-2">
                <Range
                  values={priceValues}
                  step={STEP}
                  min={MIN_PRICE_LIMIT}
                  max={MAX_PRICE_LIMIT}
                  onChange={(values) => setPriceValues(values)}
                  renderTrack={({ props, children }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        onMouseDown={restProps.onMouseDown}
                        onTouchStart={restProps.onTouchStart}
                        className="w-full flex h-1.5"
                      >
                        <div
                          ref={restProps.ref}
                          className="h-1.5 w-full rounded-full self-center"
                          style={{
                            background: getTrackBackground({
                              values: priceValues,
                              colors: ["#ccc", "#8a5830", "#ccc"],
                              min: MIN_PRICE_LIMIT,
                              max: MAX_PRICE_LIMIT,
                            }),
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    );
                  }}
                  renderThumb={({ props }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="h-4 w-4 bg-[#8a5830] rounded-full focus:outline-none cursor-pointer border-2 border-white shadow"
                        style={{ ...restProps.style }}
                      />
                    );
                  }}
                />

                <div className="flex items-center gap-1 font-poppins text-gray-500 text-xs sm:text-sm mt-4">
                  <span>Price:</span>
                  <span className="text-black font-semibold font-sans">{priceValues[0].toLocaleString()}৳</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-black font-semibold font-sans">{priceValues[1].toLocaleString()}৳</span>
                </div>
              </div>

              <div className="flex items-center justify-start mt-5 pt-4 border-t border-gray-50">
                <button 
                  onClick={handlePriceFilterSubmit}
                  className="bg-[#8a5830] text-white hover:bg-black font-semibold px-5 py-2 rounded-lg text-sm transition-all shadow-sm font-poppins cursor-pointer"
                >
                  Filter
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="hidden md:block h-5 w-[1px] bg-gray-700 mx-4"></div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => handleParamChange("view", "4")}
            className={`transition-colors cursor-pointer ${currentView === "4" ? "text-primary" : "text-white hover:text-primary"}`}
            title="4 Grid View"
          >
            <TfiLayoutGrid4Alt size={20} />
          </button>

          <button 
            onClick={() => handleParamChange("view", "5")}
            className={`flex items-center gap-[2px] transition-colors cursor-pointer ${currentView === "5" ? "text-primary" : "text-white hover:text-primary"}`}
            title="5 Grid View"
          >
            <span className="grid grid-cols-3 gap-[2px] w-[11px] h-[11px]">
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
            </span>
            <span className="grid grid-cols-2 gap-[2px] w-[7px] h-[11px]">
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
              <span className="bg-current rounded-[1px]"></span>
            </span>
          </button>
        </div>

        <div className="md:hidden text-xs text-primary select-none font-medium">
          Showing 1–{currentShowing} of {totalProducts}
        </div>
      </div>

      <div className="hidden md:block text-sm text-white select-none font-medium">
        Showing 1–{currentShowing} of {totalProducts} products
      </div>

      <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-center md:gap-6">

        <div className="flex items-center justify-between md:justify-start gap-1.5 text-xs md:text-sm">
          <span className="text-gray-300">Show:</span>
          <select
            value={searchParams.get("limit") || "16"}
            onChange={(e) => handleParamChange("limit", e.target.value)}
            className="bg-white px-2.5 py-1.5 text-center text-xs md:text-sm text-black cursor-pointer rounded-tr-xl rounded-bl-xl focus:outline-none w-full md:w-16"
          >
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="32">32</option>
          </select>
        </div>

        <div className="flex items-center justify-between md:justify-start gap-1.5 text-xs md:text-sm">
          <span className="text-gray-300 whitespace-nowrap">Sort by:</span>
          <select
            value={searchParams.get("sort") || "default"}
            onChange={(e) => handleParamChange("sort", e.target.value)}
            className="bg-white px-2.5 py-1.5 text-xs md:text-sm text-black cursor-pointer rounded-tl-xl rounded-br-xl focus:outline-none w-full md:min-w-[140px]"
          >
            <option value="default">Default</option>
            <option value="popularity">Popularity</option>
            <option value="latest">Latest</option>
            <option value="low-high">Price: Low-High</option>
            <option value="high-low">Price: High-Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;