import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { IoEyeOutline } from "react-icons/io5";
import WishListButton from "./WishListButton";

export default function ProductCard({ product }) {
  const imageSrc = product?.thumbnail || null;
  if (!imageSrc) return null;

  return (
    <div className="group w-full xs:max-w-[310px] mx-auto rounded-xl overflow-hidden font-poppins bg-[#FAFAFA] hover:shadow-2xl sm:hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-gray-200 will-change-transform flex flex-col justify-between h-full">

      <Link href={`/products/${product.id}`} className="block flex-1">
        {/* Image Container */}
        <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[340px] md:h-[380px] flex items-center justify-center overflow-hidden bg-white p-2">

          {/* Wishlist & Quick View Buttons */}
          <div className="absolute top-3 right-3 flex flex-col items-center gap-2 z-10 md:translate-x-4 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <WishListButton product={product} />
            <span className="flex bg-white/90 backdrop-blur-sm w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full shadow-md hover:bg-white transition-colors cursor-pointer shrink-0">
              <IoEyeOutline className="w-4 h-4 text-black" strokeWidth={1.5} />
            </span>
          </div>

          {/* Product Image: object-contain use kora holo jate image er kono part kete na jay, purota dekhabe */}
          <Image
            src={imageSrc}
            alt={product.title || "fashion item"}
            fill
            sizes="(max-width: 640px) 310px, (max-width: 768px) 340px, 380px"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105 p-2"
          />
        </div>

        {/* Content Section */}
        <div className="pt-3.5 pb-2.5 flex flex-col space-y-1.5 px-3 sm:px-4">
          <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 tracking-wide line-clamp-1 font-poppins">
            {product.title}
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-gray-900 text-sm sm:text-base font-bold">
              <span className="font-semibold text-xs sm:text-sm font-inter mr-0.5">৳</span>
              {product.price}
            </span>
          </div>

          <div className="flex items-center pt-0.5">
            {product?.stock > 0 ? (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded text-[10px] sm:text-xs font-medium">
                In Stock
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200/60 rounded text-[10px] sm:text-xs font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Button Section */}
      <div className="flex flex-col gap-2 px-3 sm:px-4 pb-3 sm:pb-4">
        <AddToCartButton product={product} />
      </div>

    </div>
  );
}