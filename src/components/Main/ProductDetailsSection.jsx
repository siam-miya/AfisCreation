'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md'
import { FaRegHeart, FaHeart, FaWhatsapp } from 'react-icons/fa'
import { FiMinus, FiPlus, FiPhoneCall } from 'react-icons/fi'

import AddToCartButton from '../../components/Main/AddToCartButton'
import { useCartStore } from '../../store/useCartStore'
import { useWishlistStore } from '../../store/useWishlistStore'

const ProductDetailsSection = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedColorCode, setSelectedColorCode] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [customizationText, setCustomizationText] = useState('')
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const { addToCart } = useCartStore()
  const { wishlist, toggleWishlist } = useWishlistStore()

  const productColors = Array.isArray(product?.colors) ? product.colors : []
  const productSizes = Array.isArray(product?.sizes) ? product.sizes : []

  const productImages = Array.from(
    new Set(
      [
        product?.thumbnail,
        ...(product?.images || []),
        ...(product?.colors || []).flatMap((color) =>
          typeof color === 'object' && Array.isArray(color.images)
            ? color.images.filter(Boolean)
            : []
        ),
      ].filter(Boolean)
    )
  )

  const currentImage = productImages[selectedImage] || product?.thumbnail

  const isWishlisted = wishlist?.some(
    (item) => item._id === product?._id || item.id === product?._id
  )

  useEffect(() => {
    if (product?.thumbnail) {
      const thumbnailIndex = productImages.indexOf(product.thumbnail)
      setSelectedImage(thumbnailIndex !== -1 ? thumbnailIndex : 0)
    } else {
      setSelectedImage(0)
    }

    setSelectedColor('')
    setSelectedColorCode('')

    if (productSizes.length > 0) {
      setSelectedSize(productSizes[0])
    } else {
      setSelectedSize('')
    }

    setQuantity(1)
    setCustomizationText('')
  }, [product])

  const handleColorClick = (color) => {
    setSelectedColor(color.name)
    setSelectedColorCode(color.code || color.name)

    if (Array.isArray(color.images) && color.images.length > 0) {
      const colorImage = color.images[0]
      const imageIndex = productImages.indexOf(colorImage)
      if (imageIndex !== -1) {
        setSelectedImage(imageIndex)
      }
    }
  }

  const handlePreviousImage = () => {
    if (productImages.length === 0) return
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (productImages.length === 0) return
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  const increaseQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleWishlist = () => {
    if (!product) return
    toggleWishlist(product)
  }

  const handleWhatsApp = () => {
    const message = `
Hello, I am interested in this product:

Product: ${product?.title}
Price: ৳${product?.discountPrice || product?.price}
Color: ${selectedColor || 'Not selected'}
Size: ${selectedSize || 'Not selected'}
Quantity: ${quantity}

Product Link:
${window.location.href}
`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleOrderOnCall = () => {
    window.location.href = 'tel:+8801700000000' // আপনার হটলাইন নম্বর এখানে দিন
  }

  const handleBuyNow = () => {
    if (!product) return
    addToCart({
      ...product,
      selectedColor,
      selectedColorCode,
      selectedSize,
      quantity,
      customizationText,
      selectedImage: currentImage,
    })
    window.location.href = '/checkout'
  }

  const handleCustomizationSubmit = () => {
    setShowCustomization(false)
  }

  if (!product) return null

  return (
    <>
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-6 md:py-10">
          
          {/* Top Product Name Display */}
          <div className="mb-6">
            <span className="text-lg font-bold text-gray-900">Product Name: </span>
            <span className="text-lg font-normal text-gray-700">{product?.title}</span>
            {product?.sku && (
              <span className="ml-2 text-sm text-gray-500">(SKU: {product.sku})</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-start">

            {/* ================= LEFT SIDE: IMAGES & THUMBNAILS ================= */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              
              {/* Vertical Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] pb-2 md:pb-0">
                  {productImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 ${
                        selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product?.title || 'Product'} ${index + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Preview */}
              <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-center min-h-[400px]">
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt={product?.title || 'Product image'}
                    width={600}
                    height={600}
                    priority
                    className="max-h-[450px] w-auto cursor-zoom-in object-contain"
                    onClick={() => setIsImagePopupOpen(true)}
                  />
                )}

                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePreviousImage}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 border border-gray-100"
                    >
                      <MdOutlineKeyboardArrowLeft size={24} />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 border border-gray-100"
                    >
                      <MdOutlineKeyboardArrowRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ================= RIGHT SIDE: INFO & ACTIONS ================= */}
            <div className="w-full">

              {/* STOCK STATUS */}
              <div className="mb-2">
                {product?.stock > 0 ? (
                  <p className="text-sm font-semibold text-[#00E676]">
                    In Stock
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-red-600">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* PRICE SECTION */}
              <div className="mt-2 flex items-center gap-3">
                {product?.discountPrice > 0 ? (
                  <>
                    <span className="text-3xl font-extrabold text-gray-900">
                      ৳{product.discountPrice}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-gray-900">
                    ৳{product?.price}
                  </span>
                )}
              </div>

              {/* SHORT DESCRIPTION SECTION */}
              {product?.shortDescription && (
                <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
                </div>
              )}

              {/* COLORS SELECTION */}
              {productColors.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 font-semibold text-gray-900 text-sm">
                    Color: <span className="font-normal text-gray-600 capitalize">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productColors.map((color, index) => {
                      const colorName = color?.name || `Color ${index + 1}`
                      const colorCode = color?.code || '#cccccc'
                      const isSelected = selectedColorCode === (color?.code || color?.name)
                      return (
                        <button
                          key={`${colorName}-${index}`}
                          type="button"
                          onClick={() => handleColorClick(color)}
                          title={colorName}
                          className={`relative h-8 w-8 rounded-full border transition ${
                            isSelected ? 'border-black ring-2 ring-orange-400' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: colorCode }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* SIZES SELECTION */}
              {productSizes.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                    </h3>
                    {product?.sizeChartImage && (
                      <button
                        type="button"
                        onClick={() => setShowSizeChart(true)}
                        className="text-xs font-medium text-orange-600 underline"
                      >
                        Size Chart
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((size, index) => (
                      <button
                        key={`${size}-${index}`}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                          selectedSize === size
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY & BUY NOW / WISHLIST ROW */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                
                {/* Quantity Counter */}
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white h-12">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-full w-10 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="flex h-full w-10 items-center justify-center text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={product?.stock > 0 && quantity >= product.stock}
                    className="flex h-full w-10 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product?.stock <= 0}
                  className="flex-1 h-12 rounded-lg bg-[#f27a1a] px-6 text-sm font-bold text-white shadow hover:bg-[#e06d12] transition disabled:opacity-50"
                >
                  Buy Now
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                  {isWishlisted ? <FaHeart className="text-red-500" size={18} /> : <FaRegHeart size={18} />}
                </button>
              </div>

              {/* ADD TO CART BUTTON */}
              <div className="mt-3">
                <div className="w-full [&>button]:w-full [&>button]:h-12 [&>button]:rounded-lg [&>button]:bg-black [&>button]:text-white [&>button]:font-bold [&>button]:text-sm">
                  <AddToCartButton
                    product={product}
                    selectedColor={selectedColor}
                    selectedColorCode={selectedColorCode}
                    selectedSize={selectedSize}
                    quantity={quantity}
                    customizationText={customizationText}
                    disabled={product?.stock <= 0}
                  />
                </div>
              </div>

              {/* WHATSAPP & ORDER ON CALL BUTTONS */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 h-12 rounded-lg bg-[#25D366] px-4 text-sm font-bold text-white shadow-sm hover:opacity-95 transition"
                >
                  <FaWhatsapp size={20} />
                  WhatsApp Order
                </button>

                <button
                  type="button"
                  onClick={handleOrderOnCall}
                  className="flex items-center justify-center gap-2 h-12 rounded-lg bg-[#00B0FF] px-4 text-sm font-bold text-white shadow-sm hover:opacity-95 transition"
                >
                  <FiPhoneCall size={18} />
                  Order On Call
                </button>
              </div>

            </div>
          </div>

          {/* ================= DESCRIPTION & TABS SECTION ================= */}
          <div className="mt-14 border-t border-gray-200 pt-8">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                  activeTab === 'description'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                Product Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('additional')}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
                  activeTab === 'additional'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                Additional Information
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="py-6">
                <div
                  className="prose max-w-none text-sm leading-7 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: product?.description || '',
                  }}
                />
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="py-6">
                <div className="overflow-hidden rounded-lg border border-gray-200 max-w-xl">
                  {product?.sku && (
                    <div className="grid grid-cols-2 border-b border-gray-200">
                      <div className="bg-gray-50 p-3 text-sm font-semibold">SKU</div>
                      <div className="p-3 text-sm text-gray-600">{product.sku}</div>
                    </div>
                  )}
                  {product?.category && (
                    <div className="grid grid-cols-2 border-b border-gray-200">
                      <div className="bg-gray-50 p-3 text-sm font-semibold">Category</div>
                      <div className="p-3 text-sm text-gray-600">{product.category}</div>
                    </div>
                  )}
                  {productSizes.length > 0 && (
                    <div className="grid grid-cols-2">
                      <div className="bg-gray-50 p-3 text-sm font-semibold">Available Sizes</div>
                      <div className="p-3 text-sm text-gray-600">{productSizes.join(', ')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================= MODALS (Image Popup & Size Chart) ================= */}
      {isImagePopupOpen && currentImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImagePopupOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl bg-white p-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
            <Image
              src={currentImage}
              alt={product?.title || 'Product image'}
              width={1000}
              height={1000}
              className="max-h-[85vh] w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => setIsImagePopupOpen(false)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showSizeChart && product?.sizeChartImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
            >
              ×
            </button>
            <Image
              src={product.sizeChartImage}
              alt="Size chart"
              width={1000}
              height={1000}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetailsSection