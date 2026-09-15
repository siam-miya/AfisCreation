"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Loader2, Layers, DollarSign, Image as ImageIcon, LayoutGrid, Sliders } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Active Tab State ("general" | "pricing" | "images" | "placement" | "variants")
  const [activeTab, setActiveTab] = useState("general");

  // Form Field State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    sku: "",
    price: "",
    discountPrice: "0",
    stock: "0",
    category: "",
    description: "",
    hasCustomSize: false,
    isFlashSale: false,
    isBestSelling: false,
    isNewArrival: false,
    isHotProductBanner: false,
    isHotProductSection2: false,
    isExploreProduct: true,
  });

  // Image File & Preview States
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [existingSizeChart, setExistingSizeChart] = useState("");

  const [newThumbnail, setNewThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  
  const [newSizeChart, setNewSizeChart] = useState(null);
  const [sizeChartPreview, setSizeChartPreview] = useState("");

  const [newImages, setNewImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Colors & Sizes States
  const [colors, setColors] = useState([{ name: '', code: '' }]);
  const [sizes, setSizes] = useState(['']);

  // Backend Image URL Formatter
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    if (!id) return;

    // 1. Fetch Product Details
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (res.data.success && res.data.data) {
          const product = res.data.data;
          
          setFormData({
            title: product.title || "",
            slug: product.slug || "",
            sku: product.sku || "",
            price: product.price !== undefined ? String(product.price) : "",
            discountPrice: product.discountPrice !== undefined ? String(product.discountPrice) : "0",
            stock: product.stock !== undefined ? String(product.stock) : "0",
            category: typeof product.category === "object" ? product.category?._id : (product.category || ""),
            description: product.description || "",
            hasCustomSize: Boolean(product.hasCustomSize),
            isFlashSale: Boolean(product.isFlashSale),
            isBestSelling: Boolean(product.isBestSelling),
            isNewArrival: Boolean(product.isNewArrival),
            isHotProductBanner: Boolean(product.isHotProductBanner),
            isHotProductSection2: Boolean(product.isHotProductSection2),
            isExploreProduct: product.isExploreProduct !== undefined ? Boolean(product.isExploreProduct) : true,
          });

          setExistingThumbnail(product.thumbnail || "");
          setExistingImages(product.images || []);
          setExistingSizeChart(product.sizeChartImage || "");

          if (product.colors && product.colors.length > 0) {
            setColors(product.colors.map(c => typeof c === 'string' ? { name: c, code: '' } : c));
          }

          if (product.sizes && product.sizes.length > 0) {
            setSizes(product.sizes);
          }
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error("Failed to load product details");
      }
    };

    // 2. Fetch Categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/categories/all").catch(() => null);
        if (res?.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    Promise.all([fetchProduct(), fetchCategories()]).finally(() => {
      setLoading(false);
    });
  }, [id]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSizeChartChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSizeChart(file);
      setSizeChartPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + files.length > 4) {
      toast.error("সর্বোচ্চ ৪টি ছবি রাখা যাবে।");
      return;
    }
    setNewImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  const handleColorChange = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const addColor = () => setColors([...colors, { name: '', code: '' }]);
  const removeColor = (index) => setColors(colors.filter((_, i) => i !== index));

  const handleSizeChange = (index, value) => {
    const updated = [...sizes];
    updated[index] = value;
    setSizes(updated);
  };

  const addSize = () => setSizes([...sizes, '']);
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const data = new FormData();
      
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const filteredColors = colors.filter(c => c.name.trim() !== '');
      const filteredSizes = sizes.filter(s => s.trim() !== '');

      data.append('colors', JSON.stringify(filteredColors));
      data.append('sizes', JSON.stringify(filteredSizes));

      if (newThumbnail) {
        data.append("thumbnail", newThumbnail);
      }

      if (newSizeChart) {
        data.append("sizeChartImage", newSizeChart);
      }

      if (newImages.length > 0) {
        newImages.forEach((file) => {
          data.append("images", file);
        });
      }

      const res = await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product updated successfully!");
        router.push("/secret-admin-portal-afia/dashboard/products");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white text-center">Loading product data...</div>;
  }

  return (
    <div className="p-6 md:p-10 text-black dark:text-white max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 font-poppins">
      <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold">Edit Professional Product</h2>
        <p className="text-sm text-slate-500 mt-1">Update your product specifications below using the tabs.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "general"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          <Layers size={16} /> General Info
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "pricing"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          <DollarSign size={16} /> Pricing & Stock
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("images")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "images"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          <ImageIcon size={16} /> Media & Images
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("variants")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "variants"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          <Sliders size={16} /> Colors & Sizes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("placement")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeTab === "placement"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          <LayoutGrid size={16} /> Placement
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TAB 1: General Info */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug (Auto-generated)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. SKU-101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">-- Choose Category --</option>
                  {categories.flatMap((cat) => {
                    const mainName = cat.name;
                    const options = [
                      <option key={cat._id} value={cat._id} className="font-bold">
                        📁 {mainName} (Main)
                      </option>
                    ];

                    if (cat.subcategories && cat.subcategories.length > 0) {
                      cat.subcategories.forEach((sub) => {
                        options.push(
                          <option key={sub._id} value={sub._id}>
                            &nbsp;&nbsp;&nbsp;&nbsp;↳ {sub.name}
                          </option>
                        );
                      });
                    }
                    return options;
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              ></textarea>
            </div>
          </div>
        )}

        {/* TAB 2: Pricing & Stock */}
        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium mb-2">Regular Price (৳) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discount Price (৳)</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        )}

        {/* TAB 3: Media & Images */}
        {activeTab === "images" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Thumbnail</label>
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full text-sm border p-2 rounded-xl dark:border-slate-700" />
                {(thumbnailPreview || existingThumbnail) && (
                  <img 
                    src={thumbnailPreview || getImageUrl(existingThumbnail)} 
                    alt="thumb" 
                    className="w-24 h-24 object-cover mt-2 rounded-xl border shadow-sm" 
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Size Chart Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleSizeChartChange} className="w-full text-sm border p-2 rounded-xl dark:border-slate-700" />
                {(sizeChartPreview || existingSizeChart) && (
                  <img 
                    src={sizeChartPreview || getImageUrl(existingSizeChart)} 
                    alt="sizechart" 
                    className="w-24 h-24 object-cover mt-2 rounded-xl border shadow-sm" 
                  />
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-medium mb-2">Additional Images (Optional - Max 4)</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full text-sm border p-2 rounded-xl dark:border-slate-700" />
              
              <div className="flex gap-3 mt-3 flex-wrap">
                {galleryPreviews.length > 0 ? (
                  galleryPreviews.map((src, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img src={src} alt="new-extra" className="w-full h-full object-cover rounded-xl border shadow-sm" />
                    </div>
                  ))
                ) : (
                  existingImages.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img src={getImageUrl(img)} alt="existing-extra" className="w-full h-full object-cover rounded-xl border shadow-sm" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Colors & Sizes Variants */}
        {activeTab === "variants" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-semibold mb-3">Product Colors (Optional)</label>
              {colors.map((color, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800"
                    placeholder="Color Name (e.g. Red)"
                  />
                  <input
                    type="text"
                    value={color.code}
                    onChange={(e) => handleColorChange(idx, 'code', e.target.value)}
                    className="w-24 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800"
                    placeholder="#ff0000"
                  />
                  {colors.length > 1 && (
                    <button type="button" onClick={() => removeColor(idx)} className="text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addColor} className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-2 cursor-pointer">
                <Plus size={14} /> Add More Color
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-semibold mb-3">Product Sizes (Optional)</label>
              {sizes.map((size, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => handleSizeChange(idx, e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800"
                    placeholder="e.g. Medium - 54"
                  />
                  {sizes.length > 1 && (
                    <button type="button" onClick={() => removeSize(idx)} className="text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addSize} className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-2 cursor-pointer">
                <Plus size={14} /> Add More Size
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Placement & Sections */}
        {activeTab === "placement" && (
          <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-fadeIn">
            <label className="block text-sm font-semibold mb-4">Product Placement & Sections</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasCustomSize"
                  checked={formData.hasCustomSize}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>Has Custom Size</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFlashSale"
                  checked={formData.isFlashSale}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>Flash Sale</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBestSelling"
                  checked={formData.isBestSelling}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>Best Selling</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>New Arrival</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHotProductBanner"
                  checked={formData.isHotProductBanner}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>Hot Banner</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHotProductSection2"
                  checked={formData.isHotProductSection2}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>Hot Section 2</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isExploreProduct"
                  checked={formData.isExploreProduct}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span>Explore Product</span>
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={updating}
            className="w-full px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {updating && <Loader2 className="animate-spin" size={18} />}
            {updating ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}