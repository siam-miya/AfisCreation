"use client";

import React from "react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";

const AddToCartButton = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);

  const handleAddToCart = (e) => {
    e.preventDefault();

    const productId = product._id || product.id;
    const isAlreadyInCart = cart.some((item) => (item._id || item.id) === productId);

    if (isAlreadyInCart) {
      toast.info(`"${product.title}" is already in cart!`, { position: "top-center", autoClose: 2000 });
      return;
    }

    // সঠিক আইডি সহ প্রোডাক্ট অবজেক্ট পাস করা হচ্ছে
    addToCart({ ...product, id: productId });
    toast.success(`${product.title} added!`, { position: "top-center", autoClose: 1500 });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="group/cart relative flex items-center justify-center w-full bg-secondary text-white transition-all duration-300 rounded-sm text-xs sm:text-sm font-medium font-poppins h-9 sm:h-10 overflow-hidden cursor-pointer"
    >
      <span className="transition-all duration-300 group-hover/cart:-translate-y-10 group-hover/cart:opacity-0">
        Add To Cart
      </span>
      <span className="absolute inset-0 flex items-center justify-center translate-y-10 opacity-0 group-hover/cart:translate-y-0 group-hover/cart:opacity-100">
        <FiShoppingCart size={18} />
      </span>
    </button>
  );
};

export default AddToCartButton;