"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { toast } from "react-toastify";
import { GiShoppingBag } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { Spinner } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";

const CheckoutForm = () => {
  const router = useRouter();

  const {
    cart,
    shippingMethod,
    setShippingMethod,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "true";

  const [formData, setFormData] = useState({
    fullName: "",
    streetAddress: "",
    phoneNumber: "",
    orderNotes: "",
    saveInfo: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <Spinner color="danger" />
        <span className="text-xs text-gray-400">Loading...</span>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const shippingCharge = shippingMethod === "inside" ? 70 : 130;
  const totalCost = subtotal + shippingCharge;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // ---------------------------------
    // Basic validation
    // ---------------------------------
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (
      !formData.fullName.trim() ||
      !formData.streetAddress.trim() ||
      !formData.phoneNumber.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // ---------------------------------
      // Order payload
      // ---------------------------------
      const orderPayload = {
        fullName: formData.fullName.trim(),
        streetAddress: formData.streetAddress.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        orderNotes: formData.orderNotes?.trim() || "",
        saveInfo: Boolean(formData.saveInfo),

        cart: cart.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        })),

        shippingMethod,
        shippingCharge: Number(shippingCharge),
        totalCost: Number(totalCost),
      };

      console.log("Sending order:", orderPayload);

      // ---------------------------------
      // Create order
      // ---------------------------------
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      // ---------------------------------
      // Safely read backend response
      // ---------------------------------
      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Invalid JSON response:", jsonError);
      }

      console.log("ORDER RESPONSE:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      // ---------------------------------
      // Backend rejected order
      // ---------------------------------
      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          data?.errors?.[0]?.message ||
          `Order failed (${response.status})`;

        console.error("Order creation failed:", {
          status: response.status,
          response: data,
        });

        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // ---------------------------------
      // Backend success
      // ---------------------------------
      if (!data?.success && !data?.orderId && !data?.order?._id) {
        console.error("Unexpected order response:", data);

        toast.error(
          data?.message || "Order was not created properly."
        );

        setIsLoading(false);
        return;
      }

      // ---------------------------------
      // Get generated Order ID
      // ---------------------------------
      const generatedOrderId =
        data?.orderId ||
        data?.order?.orderId ||
        `AFIS-${Date.now()}`;

      // ---------------------------------
      // Save order summary locally
      // ---------------------------------
      const orderSummaryData = {
        orderId: generatedOrderId,
        name: formData.fullName.trim(),
        phone: formData.phoneNumber.trim(),
        address: formData.streetAddress.trim(),
        shippingCost: shippingCharge,
        shippingMethod,
        cart: cart,
        total: totalCost,
      };

      localStorage.setItem(
        `order_${generatedOrderId}`,
        JSON.stringify(orderSummaryData)
      );

      // ---------------------------------
      // Clear cart
      // ---------------------------------
      if (typeof clearCart === "function") {
        clearCart();
      }

      toast.success("Order placed successfully!");

      // ---------------------------------
      // Redirect to Thank You page
      // ---------------------------------
      router.push(
        `/thank-you?orderId=${encodeURIComponent(generatedOrderId)}`
      );
    } catch (error) {
      console.error("ORDER REQUEST ERROR:", error);

      toast.error(
        "Server connection error! Please make sure the backend is running."
      );

      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handlePlaceOrder}
      className="flex flex-col lg:grid lg:grid-cols-[1fr_450px] gap-8 lg:gap-16 items-start"
    >
      {/* =========================
          BILLING DETAILS
      ========================== */}
      <div className="space-y-6 w-full">
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Your Full Name
            <span className="text-[#DB4444]">*</span>
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Your Full Address
            <span className="text-[#DB4444]">*</span>
          </label>

          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Your Phone Number
            <span className="text-[#DB4444]">*</span>
          </label>

          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Add a note to customize your product{" "}
            <span className="text-gray-400 font-normal">
              (Optional)
            </span>
          </label>

          <textarea
            name="orderNotes"
            rows={3}
            value={formData.orderNotes}
            onChange={handleInputChange}
            placeholder="Notes about your order..."
            className="w-full bg-[#F5F5F5] rounded p-3 focus:outline-none resize-none text-sm"
          />
        </div>
      </div>

      {/* =========================
          ORDER SUMMARY
      ========================== */}
      <div className="space-y-6 w-full">
        <div className="max-h-[350px] overflow-y-auto pr-2 pl-2 pt-2 space-y-4">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              Your cart is empty.
            </p>
          ) : (
            cart.map((item, idx) => {
              const uniqueKey =
                item.cartItemId ||
                item._id ||
                item.id ||
                idx;

              const itemPrice = Number(item.price) || 0;
              const itemQty = Number(item.quantity) || 1;

              return (
                <div
                  key={uniqueKey}
                  className="flex items-start justify-between gap-3 py-3 border-b border-gray-100 last:border-none"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative pt-1 pl-1 flex-shrink-0">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-center">
                        <Image
                          src={
                            item.thumbnail ||
                            "/placeholder.png"
                          }
                          alt={item.title || "Product"}
                          width={40}
                          height={40}
                          className="object-contain w-full h-full"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart &&
                          removeFromCart(
                            item.cartItemId || uniqueKey
                          )
                        }
                        className="absolute -top-1 -left-1 bg-[#E53E3E] text-white rounded-full p-0.5 z-10 flex items-center justify-center cursor-pointer"
                      >
                        <IoClose className="text-xs" />
                      </button>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-800">
                        {item.title}{" "}
                        {!isBuyNow && `(x${itemQty})`}
                      </span>

                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 mt-0.5">
                        {item.selectedColor && (
                          <span>
                            Color:{" "}
                            <strong className="text-gray-700">
                              {item.selectedColor}
                            </strong>
                          </span>
                        )}

                        {item.selectedSize && (
                          <span>
                            Size:{" "}
                            <strong className="text-gray-700">
                              {item.selectedSize}
                            </strong>
                          </span>
                        )}
                      </div>

                      {item.productNote && (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 border border-amber-200 truncate max-w-[200px]">
                          Note: {item.productNote}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-semibold text-gray-900 flex-shrink-0 text-sm">
                    ৳{(itemPrice * itemQty).toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* =========================
            SHIPPING
        ========================== */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700">
            Select Shipping Area:
          </p>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="shipping"
                checked={shippingMethod === "inside"}
                onChange={() =>
                  setShippingMethod("inside")
                }
              />

              <span>Inside Dhaka (৳70)</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="shipping"
                checked={shippingMethod === "outside"}
                onChange={() =>
                  setShippingMethod("outside")
                }
              />

              <span>Outside Dhaka (৳130)</span>
            </label>
          </div>
        </div>

        {/* =========================
            PRICE
        ========================== */}
        <div className="border-b pb-3 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Subtotal:
            </span>

            <span className="font-medium">
              ৳{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-600">
              Shipping:
            </span>

            <span className="font-medium">
              ৳{shippingCharge}
            </span>
          </div>
        </div>

        <div className="flex justify-between font-bold text-base">
          <span>Total:</span>

          <span>৳{totalCost.toFixed(2)}</span>
        </div>

        {/* =========================
            ORDER BUTTON
        ========================== */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white py-3 w-full rounded-br-3xl rounded-tl-3xl hover:bg-secondary transition-all font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <GiShoppingBag className="text-xl" />
              <span>Order now</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;