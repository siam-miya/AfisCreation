'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { GiShoppingBag } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import { HiPlus, HiMinus } from 'react-icons/hi2';

const CheckoutForm = () => {
  const { cart, shippingMethod, setShippingMethod, removeFromCart, updateQuantity } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';

  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    phoneNumber: '',
    saveInfo: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return (
    <div className="flex flex-col items-center gap-2">
      <Spinner color="danger" />
      <span className="text-xs text-muted">loading...</span>
    </div>
  );

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCharge = shippingMethod === 'inside' ? 70 : 130;
  const totalCost = subtotal + shippingCharge;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    if (updateQuantity) {
      updateQuantity(id, newQty);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!formData.fullName || !formData.streetAddress || !formData.phoneNumber) {
      toast.error('Please fill in all required fields.');
      return;
    }
    toast.success('Order placed successfully!');
  };

  return (
    <form onSubmit={handlePlaceOrder} className="flex flex-col lg:grid lg:grid-cols-[1fr_450px] gap-8 lg:gap-16 items-start">
      <div className="space-y-6 w-full">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Full Name<span className="text-[#DB4444]">*</span></label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Full Address<span className="text-[#DB4444]">*</span></label>
          <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Phone Number<span className="text-[#DB4444]">*</span></label>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none" required />
        </div>
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleInputChange} className="w-5 h-5 accent-[#DB4444]" />
          <span className="text-sm font-medium">Save this information for faster check-out</span>
        </label>
      </div>

      <div className="space-y-6 w-full">
        <div className="max-h-[300px] overflow-y-auto pr-2 pl-2 pt-2 space-y-4">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative pt-1 pl-1 flex-shrink-0">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-center">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart && removeFromCart(item.id)}
                      className="absolute -top-1 -left-1 bg-[#E53E3E] hover:bg-red-700 text-white rounded-full p-0.5 shadow-md transition-transform hover:scale-110 z-10 flex items-center justify-center cursor-pointer"
                      title="Remove item"
                    >
                      <IoClose className="text-xs" />
                    </button>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate text-gray-800 max-w-[150px] sm:max-w-[200px]">
                      {item.title} {!isBuyNow && `(x${item.quantity})`}
                    </span>

                    {isBuyNow && (
                      <div className="flex items-center border border-gray-300 rounded w-fit mt-1 bg-white">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 border-r border-gray-200"
                        >
                          <HiMinus className="text-xs" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 border-l border-gray-200"
                        >
                          <HiPlus className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <span className="font-semibold text-gray-900 flex-shrink-0">৳{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700">Select Shipping Area:</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="shipping" checked={shippingMethod === 'inside'} onChange={() => setShippingMethod('inside')} className="accent-[#DB4444]" />
              <span>Inside Dhaka (৳60)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="shipping" checked={shippingMethod === 'outside'} onChange={() => setShippingMethod('outside')} className="accent-[#DB4444]" />
              <span>Outside Dhaka (৳120)</span>
            </label>
          </div>
        </div>

        <div className="border-b pb-3 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">৳{shippingCharge}</span>
          </div>
        </div>
        <div className="flex justify-between font-bold text-base">
          <span>Total:</span>
          <span>৳{totalCost.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="bg-[#eb6e1b] text-white py-3 w-full rounded-br-3xl rounded-tl-3xl hover:bg-black transition-all font-semibold cursor-pointer flex items-center justify-center gap-2"
        >
          <GiShoppingBag className="text-xl" />
          <span>Order now</span>
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;