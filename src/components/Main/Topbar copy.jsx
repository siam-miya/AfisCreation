"use client"
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

const Topbar = () => {
  const [lang, setLang] = useState("English")
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = ["English", "বাংলা"]

  const handleSelect = (selected) => {
    setLang(selected)
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  return (
    <section className="w-full bg-black text-[#FAFAFA] p-1 px-2 md:py-3 font-poppins md:px-8">
      <div className="container flex items-center justify-between">
        <div className="hidden md:block w-20"></div>

        <div className="flex-1 text-center text-xs md:text-sm tracking-wide leading-5">
          <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
          <Link
            href="/products"
            className="font-semibold underline ml-2 transition-colors duration-200 hover:text-blue-400"
          >
            ShopNow
          </Link>
        </div>

        <div className="hidden  relative md:flex items-center gap-1" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="cursor-pointer flex items-center justify-end gap-1 text-xs md:text-sm focus:outline-none"
          >
            <span>{lang}</span>
            <IoChevronDown
              size={14}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 bg-white text-black rounded-md shadow-lg overflow-hidden min-w-[110px] z-50">
              {languages.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-gray-100 cursor-pointer ${lang === item ? "font-semibold bg-gray-50" : ""
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Topbar