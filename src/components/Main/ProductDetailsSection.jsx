'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMinusSmall } from 'react-icons/hi2';
import { GoPlus } from 'react-icons/go';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { FaBangladeshiTakaSign, FaWhatsapp, FaFacebookF } from 'react-icons/fa6';
import { FiPhoneCall, FiChevronLeft, FiChevronRight, FiX, FiShare2, FiShield, FiTruck, FiCheckCircle, FiCopy, FiCheck, FiSliders } from 'react-icons/fi';
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
  const [isOpenMoreCustomizeModal, setIsOpenMoreCustomizeModal] = useState(false); // 🆕 More Customize Modal State

  // Dynamic Colors & Sizes initialization
  const productColors = product?.colors && product.colors.length > 0 
    ? product.colors.map(c => typeof c === 'string' ? c : c.name) 
    : [];
    
  const productSizes = product?.sizes && product.sizes.length > 0 
    ? product.sizes.map(s => typeof s === 'string' ? s : s) 
    : [];

  // Selection states
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (productColors.length > 0) setSelectedColor(productColors[0]);
    if (productSizes.length > 0) setSelectedSize(productSizes[0]);
  }, [product]);

  // Custom Size / Customization Form States
  const [customLength, setCustomLength] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [customSleeve, setCustomSleeve] = useState('');
  const [productNote, setProductNote] = useState('');
  const [extraCustomPrice, setExtraCustomPrice] = useState(0);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('description');
  const [copiedLink, setCopiedLink] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    whatsappNumber: "01804673487",
    phoneNumber: "01804673487"
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const isProductInWishlist = wishlist.some((item) => (item._id || item.id) === (product?._id || product?.id));
  const isOutOfStock = (product?.stock ?? 1) <= 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modal-এর সময়ে body overflow hidden
  useEffect(() => {
    if (isOpenPopup || isOpenSizeChart || isOpenCustomSizeModal || isOpenMoreCustomizeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpenPopup, isOpenSizeChart, isOpenCustomSizeModal, isOpenMoreCustomizeModal]);

  // Dynamic extra price calculation based on Length and Width
  const calculateExtraPrice = (len, wid) => {
    const l = Number(len) || 0;
    const w = Number(wid) || 0;

    let lengthPrice = 0;
    let widthPrice = 0;

    if (product?.customSizeRules && product.customSizeRules.length > 0) {
      product.customSizeRules.forEach(rule => {
        if (rule.length && l >= rule.length) {
          lengthPrice = rule.lengthExtraTk || 0;
        }
        if (rule.width && w >= rule.width) {
          widthPrice = rule.widthExtraTk || 0;
        }
      });
    }

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

  const productImages = Array.from(
    new Set([product?.thumbnail, ...(product?.images || [])].filter(Boolean))
  );

  const handlePrevImage = () => {
    if (productImages.length === 0) return;
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (productImages.length === 0) return;
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleSizeClick = (size) => {
    if (size === "Custom Size" || product?.hasCustomSize) {
      setSelectedSize(size);
      if (size === "Custom Size") setIsOpenCustomSizeModal(true);
    } else {
      setSelectedSize(size);
      setExtraCustomPrice(0);
    }
  };

  const basePrice = product?.price || 0;
  const finalCalculatedPrice = basePrice + extraCustomPrice;

  const getCustomizedSizeText = () => {
    if (customLength || customWidth || customSleeve) {
      return `Customized (L:${customLength || 0}", W:${customWidth || 0}"${customSleeve ? `, S:${customSleeve}"` : ''})`;
    }
    return selectedSize;
  };

  const handleBuyNow = () => {
    if (product && !isOutOfStock) {
      const productPayload = {
        ...product,
        price: finalCalculatedPrice,
        selectedColor,
        selectedSize: getCustomizedSizeText(),
        productNote
      };
      for (let i = 0; i < quantity; i++) {
        addToCart(productPayload);
      }
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const rawWhatsapp = siteSettings?.whatsappNumber || "01804673487";
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, '');
  const callNumber = siteSettings?.phoneNumber || "01804673487";

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappMessage = `Hello, I want to order this product:\n\n🛍️ *Product:* ${product?.title}\n🎨 *Color:* ${selectedColor}\n📏 *Size:* ${getCustomizedSizeText()}\n📝 *Note:* ${productNote || 'N/A'}\n💰 *Price:* ৳${finalCalculatedPrice}\n🔢 *Quantity:* ${quantity}\n🔗 *Link:* ${currentUrl}`;
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
            {productImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 hover:bg-white text-gray-600 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border border-gray-100 opacity-0 group-hover:opacity-100"
              >
                <FiChevronLeft size={20} />
              </button>
            )}
            <div className="relative w-full h-full">
              {productImages[selectedImage] && (
                <Image
                  src={productImages[selectedImage]}
                  alt={product?.title || "Product Image"}
                  fill
                  className="object-contain p-2"
                  priority
                  sizes="(max-width: 1024px) 70vw, 45vw"
                />
              )}
            </div>
            {productImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 hover:bg-white text-gray-600 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border border-gray-100 opacity-0 group-hover:opacity-100"
              >
                <FiChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product?.title}</h1>
            <span className={`${!isOutOfStock ? 'text-[#00FF66]' : 'text-red-500'} font-medium text-sm flex items-center gap-1`}>
              {!isOutOfStock ? <FiCheckCircle size={14} /> : null}
              {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="text-2xl font-bold flex items-center gap-1">
            <FaBangladeshiTakaSign />{finalCalculatedPrice}
            {extraCustomPrice > 0 && (
              <span className="text-xs font-normal text-green-600 ml-2 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                (+৳{extraCustomPrice} Custom Extra)
              </span>
            )}
          </div>

          {/* Color Selection */}
          {productColors.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 min-w-[60px]">Color:</span>
              <div className="flex flex-wrap gap-2">
                {productColors.map((color, idx) => (
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
          )}

          {/* Size & Customize Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-medium text-gray-700 min-w-[60px]">Size:</span>
              {productSizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSizeClick(size)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium border transition-all rounded-sm cursor-pointer ${
                    selectedSize === size && !customLength && !customWidth ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-black hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}

              {/* 🆕 More Customize Button */}
              <button
                onClick={() => setIsOpenMoreCustomizeModal(true)}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all rounded cursor-pointer flex items-center gap-1 bg-primary/5"
              >
                <FiSliders size={15} /> More Customize
              </button>

              {product?.sizeChartImage && (
                <button
                  onClick={() => setIsOpenSizeChart(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-black border-b border-black pb-0.5 ml-1 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  <PiRuler size={16} /> Size Chart
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-2 md:gap-4 h-12">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden h-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="px-4 hover:bg-gray-100 h-full border-r border-gray-300 cursor-pointer disabled:opacity-50"
                >
                  <HiMinusSmall />
                </button>
                <div className="w-12 text-center font-medium">{String(quantity).padStart(2, '0')}</div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="px-4 bg-primary hover:bg-secondary text-white h-full cursor-pointer transition-colors disabled:opacity-50"
                >
                  <GoPlus />
                </button>
              </div>

              <Link
                href={isOutOfStock ? '#' : '/checkout'}
                onClick={handleBuyNow}
                aria-disabled={isOutOfStock}
                className={`flex-1 font-medium h-full rounded flex items-center justify-center transition-all ${
                  isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none' : 'bg-primary hover:bg-secondary text-white'
                }`}
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
              <AddToCartButton 
                product={{ 
                  ...product, 
                  price: finalCalculatedPrice, 
                  selectedColor, 
                  selectedSize: getCustomizedSizeText(), 
                  productNote 
                }} 
                disabled={isOutOfStock}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href={isMounted && !isOutOfStock ? whatsappUrl : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 text-white font-medium py-3 px-4 rounded transition-all text-sm sm:text-base shadow-sm whitespace-nowrap min-h-[48px] ${
                  isOutOfStock ? 'bg-gray-300 cursor-not-allowed pointer-events-none' : 'bg-[#25D366] hover:bg-[#20ba5a]'
                }`}
              >
                <FaWhatsapp className="text-xl shrink-0" />
                WhatsApp Order
              </Link>
              <Link
                href={isMounted && !isOutOfStock ? `tel:${callNumber}` : '#'}
                className={`flex-1 flex items-center justify-center gap-2 text-white font-medium py-3 px-4 rounded transition-all text-sm sm:text-base shadow-sm whitespace-nowrap min-h-[48px] ${
                  isOutOfStock ? 'bg-gray-300 cursor-not-allowed pointer-events-none' : 'bg-[#10b981] hover:bg-[#059669]'
                }`}
              >
                <FiPhoneCall className="text-lg shrink-0" />
                Order On Call
              </Link>
            </div>

            {/* Social Share */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm text-gray-600">
              <span className="flex items-center gap-1.5 font-medium"><FiShare2 size={16} /> Share Product:</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyLink} 
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer text-xs font-medium"
                >
                  {copiedLink ? <FiCheck className="text-green-600" size={14} /> : <FiCopy size={14} />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-blue-600"
                  title="Share on Facebook"
                >
                  <FaFacebookF size={14} />
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-100">
                <FiShield className="text-primary mb-1" size={18} />
                <span className="text-[11px] font-medium text-gray-700">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-100">
                <FiTruck className="text-primary mb-1" size={18} />
                <span className="text-[11px] font-medium text-gray-700">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-100">
                <FiPhoneCall className="text-primary mb-1" size={18} />
                <span className="text-[11px] font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t pt-8">
        <div className="flex border-b border-gray-200 gap-8 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 font-semibold text-sm sm:text-base transition-colors relative cursor-pointer ${
              activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-black'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 font-semibold text-sm sm:text-base transition-colors relative cursor-pointer ${
              activeTab === 'delivery' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-black'
            }`}
          >
            Delivery & Returns
          </button>
        </div>

        {activeTab === 'description' && (
          <p className="text-gray-600 leading-relaxed text-sm max-w-4xl">{product?.description}</p>
        )}

        {activeTab === 'delivery' && (
          <div className="text-gray-600 text-sm max-w-4xl space-y-2">
            <p>🚚 <strong>Home Delivery:</strong> Inside Dhaka 2-3 days, Outside Dhaka 3-5 business days.</p>
            <p>🔄 <strong>Return Policy:</strong> Easy 7-day return or exchange policy if product has any defect.</p>
            <p>📞 <strong>Customer Support:</strong> Call or WhatsApp us anytime at {callNumber} for assistance.</p>
          </div>
        )}
      </div>

      {/* Image Zoom Popup Modal */}
      {isOpenPopup && (
        <div onClick={() => setIsOpenPopup(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-xl p-6 w-full max-w-xl md:max-w-2xl aspect-square flex items-center justify-center shadow-2xl overflow-hidden">
            <button onClick={() => setIsOpenPopup(false)} className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full cursor-pointer"><FiX size={20} /></button>
            <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer border"><FiChevronLeft size={24} /></button>
            <div className="relative w-full h-full max-h-[85%]">
              {productImages[selectedImage] && (
                <Image src={productImages[selectedImage]} alt="Zoom" fill className="object-contain" />
              )}
            </div>
            <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer border"><FiChevronRight size={24} /></button>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isOpenSizeChart && (
        <div onClick={() => setIsOpenSizeChart(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-lg font-bold">Size Chart</h3>
              <button onClick={() => setIsOpenSizeChart(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"><FiX size={18} /></button>
            </div>
            
            {product?.sizeChartImage ? (
              <div className="relative w-full h-[400px]">
                <Image src={product.sizeChartImage} alt="Size Chart" fill className="object-contain" />
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No size chart available.</div>
            )}
          </div>
        </div>
      )}

      {/* 🆕 MORE CUSTOMIZE POPUP MODAL */}
      {isOpenMoreCustomizeModal && (
        <div onClick={() => setIsOpenMoreCustomizeModal(false)} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 mb-4 sticky top-0 bg-white z-10 border-b">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiSliders className="text-primary" /> Product Customization
              </h3>
              <button onClick={() => setIsOpenMoreCustomizeModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-5 bg-gray-50 p-2.5 rounded border border-gray-100">
              💡 <strong>Note:</strong> Enter your custom length & width measurements below. Extra charges will be added automatically based on size rules.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Length (in)</label>
                <input
                  type="number"
                  value={customLength}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-center text-sm focus:outline-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Width (in)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-center text-sm focus:outline-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sleeve (in)</label>
                <input
                  type="number"
                  value={customSleeve}
                  onChange={(e) => setCustomSleeve(e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-center text-sm focus:outline-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Special Instructions / Note</label>
              <textarea
                value={productNote}
                onChange={(e) => setProductNote(e.target.value)}
                placeholder="Write any specific measurement instructions here..."
                rows="2"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-primary focus:ring-1 focus:ring-primary resize-none"
              ></textarea>
            </div>

            {/* Calculated Price Display */}
            <div className="bg-primary/5 p-4 rounded-lg text-center mb-5 border border-primary/20">
              <span className="text-xs text-gray-600 block mb-1">Calculated Total Price:</span>
              <div className="text-xl font-bold text-primary flex items-center justify-center gap-1">
                <FaBangladeshiTakaSign />{finalCalculatedPrice}
                {extraCustomPrice > 0 && (
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    (Base: ৳{basePrice} + Custom: ৳{extraCustomPrice})
                  </span>
                )}
              </div>
            </div>

            {/* Custom Rules Pricing Chart */}
            {product?.customSizeRules && product.customSizeRules.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-800 text-white text-center font-semibold py-1.5 text-xs">
                  Custom Size Extra Pricing Reference
                </div>
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                      <th className="py-2 border-r border-gray-200 font-semibold">Min Length</th>
                      <th className="py-2 border-r border-gray-200 font-semibold">Extra Charge</th>
                      <th className="py-2 border-r border-gray-200 font-semibold">Min Width</th>
                      <th className="py-2 font-semibold">Extra Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.customSizeRules.map((rule, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="py-1.5 border-r border-gray-100">{rule.length ? `${rule.length}"` : '-'}</td>
                        <td className="py-1.5 border-r border-gray-100 text-green-600 font-medium">+{rule.lengthExtraTk || 0} TK</td>
                        <td className="py-1.5 border-r border-gray-100">{rule.width ? `${rule.width}"` : '-'}</td>
                        <td className="py-1.5 text-green-600 font-medium">+{rule.widthExtraTk || 0} TK</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpenMoreCustomizeModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg font-medium text-center text-sm transition-colors cursor-pointer border border-gray-200"
              >
                Apply Customization
              </button>
              <Link
                href="/checkout"
                onClick={() => {
                  handleBuyNow();
                  setIsOpenMoreCustomizeModal(false);
                }}
                className="flex-1 bg-primary hover:bg-secondary text-white py-2.5 rounded-lg font-medium text-center text-sm transition-colors block"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsSection;