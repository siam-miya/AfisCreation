"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form Field State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPrice: "0",
    stock: "0",
    category: "",
    description: "",
    isFlashSale: false,
    isBestSelling: false,
  });

  // Image File & Preview States
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Backend Image URL Formatter
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    if (!id) return;

    // 1. Fetch Product Details (Route: /api/products/:id)
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (res.data.success && res.data.data) {
          const product = res.data.data;
          
          setFormData({
            title: product.title || "",
            price: product.price !== undefined ? String(product.price) : "",
            discountPrice: product.discountPrice !== undefined ? String(product.discountPrice) : "0",
            stock: product.stock !== undefined ? String(product.stock) : "0",
            category: typeof product.category === "object" ? product.category?._id : (product.category || ""),
            description: product.description || "",
            isFlashSale: Boolean(product.isFlashSale),
            isBestSelling: Boolean(product.isBestSelling),
          });

          setExistingThumbnail(product.thumbnail || "");
          setExistingImages(product.images || []);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Thumbnail File Change Handler
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Gallery Files Change Handler
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  // Submit Handler (Route: /api/products/:id)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("isFlashSale", formData.isFlashSale);
      data.append("isBestSelling", formData.isBestSelling);

      if (newThumbnail) {
        data.append("thumbnail", newThumbnail);
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
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-md">
        {/* Title */}
        <div>
          <label className="block mb-2 text-sm font-medium">Product Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-800 rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        {/* Price, Discount Price, Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Price (৳) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Discount Price (৳)</label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500"
              required
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-2 text-sm font-medium">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-800 rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2.5 bg-gray-800 rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500"
            required
          ></textarea>
        </div>

        {/* Thumbnail Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Thumbnail</label>
          <div className="flex items-center gap-4">
            {thumbnailPreview ? (
              <div className="w-20 h-20 rounded border border-orange-500 overflow-hidden">
                <img src={thumbnailPreview} alt="New Preview" className="object-cover w-full h-full" />
              </div>
            ) : existingThumbnail ? (
              <div className="w-20 h-20 rounded border border-gray-600 overflow-hidden">
                <img src={getImageUrl(existingThumbnail)} alt="Existing" className="object-cover w-full h-full" />
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="flex-1 p-2 bg-gray-800 rounded border border-gray-600 text-sm text-gray-300"
            />
          </div>
        </div>

        {/* Gallery Images */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gallery Images</label>
          {existingImages.length > 0 && galleryPreviews.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img, idx) => (
                <div key={idx} className="w-16 h-16 rounded border border-gray-700 overflow-hidden">
                  <img src={getImageUrl(img)} alt={`Gallery ${idx}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
          {galleryPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {galleryPreviews.map((src, idx) => (
                <div key={idx} className="w-16 h-16 rounded border border-orange-500 overflow-hidden">
                  <img src={src} alt={`New Gallery ${idx}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm text-gray-300"
          />
        </div>

        {/* Section Flags */}
        <div className="flex items-center gap-6 pt-2 border-t border-gray-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFlashSale"
              checked={formData.isFlashSale}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm">Flash Sale</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSelling"
              checked={formData.isBestSelling}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm">Best Selling</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updating}
          className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
        >
          {updating ? "Updating Product..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}