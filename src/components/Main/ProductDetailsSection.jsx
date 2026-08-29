'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMinusSmall } from 'react-icons/hi2';
import { GoPlus } from 'react-icons/go';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { FaBangladeshiTakaSign, FaWhatsapp } from 'react-icons/fa6';
import { FiPhoneCall, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { PiRuler } from 'react-icons/pi';
import AddToCartButton from './AddToCartButton';

const ProductDetailsSection = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
 
  // Modals state
  const [isOpenSizeChart, setIsOpenSizeChart] = useState(false);
  const [isOpenCustomSizeModal, setIsOpenCustomSizeModal] = useState(false);

  // Selection states
  const [selectedColor, setSelectedColor] = useState("Mauve");
  const [selectedSize, setSelectedSize] = useState("Small - 52");

  // Custom Size Form States
  const [customLength, setCustomLength] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [customSleeve, setCustomSleeve] = useState('');
  const [productNote, setProductNote] = useState('');
  const [extraCustomPrice, setExtraCustomPrice] = useState(0);

  const [siteSettings, setSiteSettings] = useState({
    whatsappNumber: "01804673487",
    phoneNumber: "01804673487"
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const isProductInWishlist = wishlist.some((item) => item.id === product?.id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpenPopup || isOpenSizeChart || isOpenCustomSizeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpenPopup, isOpenSizeChart, isOpenCustomSizeModal]);

  const calculateExtraPrice = (len, wid) => {
    const l = Number(len) || 0;
    const w = Number(wid) || 0;

    let lengthPrice = 0;
    if (l >= 62) lengthPrice = 450;
    else if (l >= 59) lengthPrice = 250;

    let widthPrice = 0;
    if (w >= 49) widthPrice = 250;

    return lengthPrice + widthPrice;
  };

  const handleLengthChange = (val) => {
    setCustomLength(val);
    const newPrice = calculateExtraPrice(val, customWidth);
    setExtraCustomPrice(newPrice);
  };

  const handleWidthChange = (val) => {
    setCustomWidth(val);
    const newPrice = calculateExtraPrice(customLength, val);
    setExtraCustomPrice(newPrice);
  };

  const productImages = product?.images?.length ? product.images : [product?.thumbnail];

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const colors = ["Mauve"];
  const sizes = ["Small - 52", "Medium - 54", "Large - 56", "Custom Size"];

  const handleSizeClick = (size) => {
    if (size === "Custom Size") {
      setSelectedSize("Custom Size");
      setIsOpenCustomSizeModal(true);
    } else {
      setSelectedSize(size);
      setExtraCustomPrice(0);
    }
  };

  const basePrice = product?.price || 0;
  const finalCalculatedPrice = basePrice + extraCustomPrice;

  const handleBuyNow = () => {
    if (product) {
      const productPayload = {
        ...product,
        price: finalCalculatedPrice,
        selectedColor,
        selectedSize: selectedSize === "Custom Size" ? `Custom (L:${customLength}, W:${customWidth}, S:${customSleeve})` : selectedSize,
        productNote
      };
      for (let i = 0; i < quantity; i++) {
        addToCart(productPayload);
      }
    }
  };

  const rawWhatsapp = siteSettings?.whatsappNumber || "01804673487";
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, '');
  const callNumber = siteSettings?.phoneNumber || "01804673487";

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappMessage = `Hello, I want to order this product:\n\n🛍️ *Product:* ${product?.title}\n🎨 *Color:* ${selectedColor}\n📏 *Size:* ${selectedSize === "Custom Size" ? `Custom Size (Length: ${customLength}, Width: ${customWidth}, Sleeve: ${customSleeve})` : selectedSize}\n📝 *Note:* ${productNote || 'N/A'}\n💰 *Price:* ৳${finalCalculatedPrice}\n🔢 *Quantity:* ${quantity}\n🔗 *Link:* ${currentUrl}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full pt-8 pb-16 px-4 md:px-8 lg:px-10 text-black select-none font-poppins clear-both">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* Image Gallery Section */}
        <div className="lg:col-span-7 flex gap-3 h-[320px] sm:h-[400px] md:h-[500px] w-full">
          <div className="flex flex-col gap-2 overflow-y-auto pr-1 no-scrollbar max-h-full w-16 sm:w-20 md:w-24 shrink-0">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-full aspect-square bg-white p-1 rounded-md border-2 transition-all flex items-center justify-center shrink-0 ${
                  selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-400 cursor-pointer'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image src={img} alt={`thumb-${index}`} fill className="object-contain" sizes="(max-width: 768px) 60px, 96px" />
                </div>
              </button>
            ))}
          </div>
          <div
            onClick={() => setIsOpenPopup(true)}
            className="flex-1 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-4 relative group h-full overflow-hidden shadow-sm cursor-zoom-in"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 hover:bg-white text-gray-600 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border border-gray-100 opacity-0 group-hover:opacity-100"
            >
              <FiChevronLeft size={20} />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={productImages[selectedImage] || product?.thumbnail}
                alt={product?.title || "Product Image"}
                fill
                className="object-contain p-2"
                priority
                sizes="(max-width: 1024px) 70vw, 45vw"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 hover:bg-white text-gray-600 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border border-gray-100 opacity-0 group-hover:opacity-100"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product?.title}</h1>
            <span className={`${product?.stock > 0 ? 'text-[#00FF66]' : 'text-red-500'} font-medium text-sm`}>
              {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="text-2xl font-bold flex items-center gap-1">
            <FaBangladeshiTakaSign />{finalCalculatedPrice}
          </div>

          {/* Color Selection UI */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 min-w-[60px]">Color:</span>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-1.5 text-sm font-medium border transition-all rounded-sm cursor-pointer ${
                    selectedColor === color ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-black hover:border-primary'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection UI */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-gray-700 min-w-[60px]">Size:</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {sizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSizeClick(size)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium border transition-all rounded-sm cursor-pointer ${
                    selectedSize === size ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-black hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
             
              <button
                onClick={() => setIsOpenSizeChart(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-black border-b border-black pb-0.5 ml-2 hover:opacity-75 transition-opacity cursor-pointer"
              >
                <PiRuler size={16} /> Size Chart
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-2 md:gap-4 h-12">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden h-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:bg-gray-100 h-full border-r border-gray-300 cursor-pointer"
                >
                  <HiMinusSmall />
                </button>
                <div className="w-12 text-center font-medium">{String(quantity).padStart(2, '0')}</div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 bg-primary hover:bg-secondary text-white h-full cursor-pointer transition-colors"
                >
                  <GoPlus />
                </button>
              </div>

              <Link
                href="/checkout"
                onClick={handleBuyNow}
                className="flex-1 bg-primary hover:bg-secondary text-white font-medium h-full rounded flex items-center justify-center transition-all"
              >
                Buy Now
              </Link>

              <button
                onClick={() => product && toggleWishlist(product)}
                className="w-12 h-full border border-gray-300 rounded flex items-center justify-center hover:border-primary transition-all cursor-pointer"
              >
                <svg className={`w-6 h-6 ${isMounted && isProductInWishlist ? 'fill-red-500 text-red-500' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="w-full">
              <AddToCartButton product={{ ...product, price: finalCalculatedPrice, selectedColor, selectedSize: selectedSize === "Custom Size" ? `Custom (L:${customLength}, W:${customWidth}, S:${customSleeve})` : selectedSize, productNote }} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href={isMounted ? whatsappUrl : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium py-3 px-4 rounded transition-all text-sm sm:text-base shadow-sm whitespace-nowrap min-h-[48px]"
              >
                <FaWhatsapp className="text-xl shrink-0" />
                WhatsApp Order
              </Link>
              <Link
                href={isMounted ? `tel:${callNumber}` : '#'}
                className="flex-1 flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-medium py-3 px-4 rounded transition-all text-sm sm:text-base shadow-sm whitespace-nowrap min-h-[48px]"
              >
                <FiPhoneCall className="text-lg shrink-0" />
                Order On Call
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t pt-8">
        <h2 className="text-lg font-semibold mb-4">Product Description</h2>
        <p className="text-gray-600 leading-relaxed text-sm max-w-4xl">{product?.description}</p>
      </div>

      {/* Modals and Overlays with Proper z-index and Fixed Centering */}
      {isOpenPopup && (
        <div onClick={() => setIsOpenPopup(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-xl p-6 w-full max-w-xl md:max-w-2xl aspect-square flex items-center justify-center shadow-2xl overflow-hidden">
            <button onClick={() => setIsOpenPopup(false)} className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full cursor-pointer"><FiX size={20} /></button>
            <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer border"><FiChevronLeft size={24} /></button>
            <div className="relative w-full h-full max-h-[85%]"><Image src={productImages[selectedImage]} alt="Zoom" fill className="object-contain" /></div>
            <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer border"><FiChevronRight size={24} /></button>
          </div>
        </div>
      )}

      {isOpenSizeChart && (
        <div onClick={() => setIsOpenSizeChart(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-lg font-bold">Size Chart</h3>
              <button onClick={() => setIsOpenSizeChart(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"><FiX size={18} /></button>
            </div>
           
            <div className="border border-black rounded-lg overflow-hidden mb-6">
              <div className="bg-black text-white text-center font-bold py-2 text-sm">Regular Fit (inch)</div>
              <table className="w-full text-center text-sm border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="py-2 border-r border-black font-semibold">Size</th>
                    <th className="py-2 border-r border-black font-semibold">Length</th>
                    <th className="py-2 border-r border-black font-semibold">Width</th>
                    <th className="py-2 font-semibold">Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300"><td className="py-2 border-r border-black font-medium">Small</td><td className="py-2 border-r border-black">52</td><td className="py-2 border-r border-black">42</td><td className="py-2">21</td></tr>
                  <tr className="border-b border-gray-300"><td className="py-2 border-r border-black font-medium">Medium</td><td className="py-2 border-r border-black">54</td><td className="py-2 border-r border-black">44</td><td className="py-2">22</td></tr>
                  <tr><td className="py-2 border-r border-black font-medium">Large</td><td className="py-2 border-r border-black">56</td><td className="py-2 border-r border-black">46</td><td className="py-2">23</td></tr>
                </tbody>
              </table>
            </div>

            <div className="border border-black rounded-lg overflow-hidden">
              <div className="bg-black text-white text-center font-bold py-2 text-sm">Add Custom Size</div>
              <table className="w-full text-center text-sm border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="py-2 border-r border-black font-semibold">Length</th>
                    <th className="py-2 border-r border-black font-semibold">Add Extra Tk</th>
                    <th className="py-2 border-r border-black font-semibold">Width</th>
                    <th className="py-2 font-semibold">Add Extra Tk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">57</td><td className="py-2 border-r border-black">0 TK</td><td className="py-2 border-r border-black">47</td><td className="py-2">0 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">58</td><td className="py-2 border-r border-black">0 TK</td><td className="py-2 border-r border-black">48</td><td className="py-2">0 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">59</td><td className="py-2 border-r border-black">250 TK</td><td className="py-2 border-r border-black">49</td><td className="py-2">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">60</td><td className="py-2 border-r border-black">250 TK</td><td className="py-2 border-r border-black">50</td><td className="py-2">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">61</td><td className="py-2 border-r border-black">250 TK</td><td className="py-2 border-r border-black">51</td><td className="py-2">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">62</td><td className="py-2 border-r border-black">450 TK</td><td className="py-2 border-r border-black">52</td><td className="py-2">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">63</td><td className="py-2 border-r border-black">450 TK</td><td className="py-2 border-r border-black">53</td><td className="py-2">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-2 border-r border-black">64</td><td className="py-2 border-r border-black">450 TK</td><td className="py-2 border-r border-black">54</td><td className="py-2">250 TK</td></tr>
                  <tr><td className="py-2 border-r border-black">65</td><td className="py-2 border-r border-black">450 TK</td><td className="py-2 border-r border-black">55</td><td className="py-2">250 TK</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isOpenCustomSizeModal && (
        <div onClick={() => setIsOpenCustomSizeModal(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-1 sticky top-0 bg-white pt-2 pb-2 z-10 border-b">
              <h3 className="text-lg font-bold text-center w-full">Give Your Preferred Size</h3>
              <button onClick={() => setIsOpenCustomSizeModal(false)} className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"><FiX size={18} /></button>
            </div>
            <p className="text-xs text-center text-gray-500 mb-6 mt-2">Price increase based on size</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div>
                <label className="block text-center text-xs font-semibold mb-1">Length</label>
                <input
                  type="number"
                  value={customLength}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  placeholder="Length"
                  className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:outline-primary"
                />
              </div>
              <div>
                <label className="block text-center text-xs font-semibold mb-1">Width</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  placeholder="Width"
                  className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:outline-primary"
                />
              </div>
              <div>
                <label className="block text-center text-xs font-semibold mb-1">Sleeve</label>
                <input
                  type="number"
                  value={customSleeve}
                  onChange={(e) => setCustomSleeve(e.target.value)}
                  placeholder="Sleeve"
                  className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:outline-primary"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-center text-xs font-semibold mb-1">Product Note</label>
              <textarea
                value={productNote}
                onChange={(e) => setProductNote(e.target.value)}
                placeholder="Product Note..."
                rows="2"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-primary resize-none"
              ></textarea>
            </div>

            <div className="text-center font-bold text-base mb-6">
              Product Price: <span className="text-black">৳{finalCalculatedPrice}</span>
            </div>

            <div className="border border-black rounded-lg overflow-hidden mb-6">
              <div className="bg-black text-white text-center font-bold py-2 text-xs">Custom Size Pricing Chart</div>
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="py-1.5 border-r border-black font-semibold">Length</th>
                    <th className="py-1.5 border-r border-black font-semibold">Add Extra Tk</th>
                    <th className="py-1.5 border-r border-black font-semibold">Width</th>
                    <th className="py-1.5 font-semibold">Add Extra Tk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">57</td><td className="py-1 border-r border-black">0 TK</td><td className="py-1 border-r border-black">47</td><td className="py-1">0 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">58</td><td className="py-1 border-r border-black">0 TK</td><td className="py-1 border-r border-black">48</td><td className="py-1">0 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">59</td><td className="py-1 border-r border-black">250 TK</td><td className="py-1 border-r border-black">49</td><td className="py-1">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">60</td><td className="py-1 border-r border-black">250 TK</td><td className="py-1 border-r border-black">50</td><td className="py-1">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">61</td><td className="py-1 border-r border-black">250 TK</td><td className="py-1 border-r border-black">51</td><td className="py-1">250 TK</td></tr>
                  <tr className="bordeer-b border-gray-200"><td className="py-1 border-r border-black">62</td><td className="py-1 border-r border-black">450 TK</td><td className="py-1 border-r border-black">52</td><td className="py-1">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">63</td><td className="py-1 border-r border-black">450 TK</td><td className="py-1 border-r border-black">53</td><td className="py-1">250 TK</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1 border-r border-black">64</td><td className="py-1 border-r border-black">450 TK</td><td className="py-1 border-r border-black">54</td><td className="py-1">250 TK</td></tr>
                  <tr><td className="py-1 border-r border-black">65</td><td className="py-1 border-r border-black">450 TK</td><td className="py-1 border-r border-black">55</td><td className="py-1">250 TK</td></tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mb-2">
              <Link
                href="/checkout"
                onClick={() => {
                  handleBuyNow();
                  setIsOpenCustomSizeModal(false);
                }}
                className="flex-1 bg-primary hover:bg-secondary text-white py-2.5 rounded font-medium text-center text-sm transition-all"
              >
                Buy Now
              </Link>
              <button
                onClick={() => setIsOpenCustomSizeModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded font-medium text-center text-sm transition-all cursor-pointer border border-gray-200"
              >
                Confirm Size
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsSection;