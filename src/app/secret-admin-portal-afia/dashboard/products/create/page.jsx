'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, X } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    hasCustomSize: false,
    isFlashSale: false,
    isBestSelling: false,
    isNewArrival: false,
    isHotProductBanner: false,
    isHotProductSection2: false,
    isExploreProduct: true,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [extraImages, setExtraImages] = useState([]);
  const [extraImagePreviews, setExtraImagePreviews] = useState([]);
  const [sizeChartFile, setSizeChartFile] = useState(null);
  const [sizeChartPreview, setSizeChartPreview] = useState('');

  const [colors, setColors] = useState([{ name: '', code: '' }]);
  const [sizes, setSizes] = useState(['']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // ব্যাকএন্ডের সঠিক রুট `/all` বা `/main-categories` এখানে যুক্ত করতে হবে
        const res = await fetch(`${apiUrl}/api/v1/categories/all`);

        if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        } else if (Array.isArray(result)) {
          setCategories(result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSizeChartChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSizeChartFile(file);
      setSizeChartPreview(URL.createObjectURL(file));
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (extraImagePreviews.length + files.length > 4) {
      alert("সর্বোচ্চ ৪টি অতিরিক্ত ছবি আপলোড করা যাবে।");
      return;
    }
    setExtraImages((prev) => [...prev, ...files]);
    setExtraImagePreviews((prev) => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExtraImage = (index) => {
    setExtraImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
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

const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = new FormData();
      
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const filteredColors = colors.filter(c => c.name.trim() !== '');
      const filteredSizes = sizes.filter(s => s.trim() !== '');

      data.append('colors', JSON.stringify(filteredColors));
      data.append('sizes', JSON.stringify(filteredSizes));

      if (thumbnailFile) data.append('thumbnail', thumbnailFile);
      if (sizeChartFile) data.append('sizeChartImage', sizeChartFile);
      
      // অতিরিক্ত ছবিগুলো অ্যাপেন্ড করা (যদি ব্যাকএন্ডে হ্যান্ডেল করা থাকে)
      extraImages.forEach((file) => data.append('images', file));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to create product');

      setSuccessMsg('Product added successfully!');
      setTimeout(() => {
        router.push('/secret-admin-portal-afia/dashboard/products');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 font-poppins text-black dark:text-white">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold">Add New Professional Product</h2>
        <p className="text-sm text-slate-500 mt-1">Fill out the details below to publish your item to the store.</p>
      </div>

      {errorMsg && <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/30 text-rose-500 rounded-xl text-sm">{errorMsg}</div>}
      {successMsg && <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 rounded-xl text-sm">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Premium Rechargeable Fan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug (Auto-generated)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 text-sm"
              placeholder="premium-rechargeable-fan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Choose Category --</option>
              {loadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories.flatMap((cat) => {
                  const mainName = cat.name;
                  const options = [
                    <option key={cat._id} value={mainName} className="font-bold">
                      📁 {mainName} (Main)
                    </option>
                  ];

                  if (cat.subcategories && cat.subcategories.length > 0) {
                    cat.subcategories.forEach((sub) => {
                      options.push(
                        <option key={sub._id} value={sub.name}>
                          &nbsp;&nbsp;&nbsp;&nbsp;↳ {sub.name}
                        </option>
                      );
                    });
                  }
                  return options;
                })
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Regular Price (৳) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="1500"
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
              placeholder="1200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Write detailed product specifications..."
          ></textarea>
        </div>

        {/* Product Promotion / Section Checkboxes */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-semibold mb-3">Product Placement & Sections</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

        {/* Colors & Sizes Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-semibold mb-2">Product Colors (Optional)</label>
            {colors.map((color, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800"
                  placeholder="Color Name (e.g. Red)"
                />
                <input
                  type="text"
                  value={color.code}
                  onChange={(e) => handleColorChange(idx, 'code', e.target.value)}
                  className="w-24 border border-gray-300 dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800"
                  placeholder="#ff0000"
                />
                {colors.length > 1 && (
                  <button type="button" onClick={() => removeColor(idx)} className="text-red-500"><Trash2 size={18} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={addColor} className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-1">
              <Plus size={14} /> Add More Color
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Product Sizes (Optional)</label>
            {sizes.map((size, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(idx, e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800"
                  placeholder="e.g. Medium - 54"
                />
                {sizes.length > 1 && (
                  <button type="button" onClick={() => removeSize(idx)} className="text-red-500"><Trash2 size={18} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSize} className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-1">
              <Plus size={14} /> Add More Size
            </button>
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail Image (Main) *</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full text-sm border p-2 rounded-xl dark:border-slate-700" required />
            {thumbnailPreview && <img src={thumbnailPreview} alt="thumb" className="w-20 h-20 object-cover mt-2 rounded-lg border" />}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size Chart Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleSizeChartChange} className="w-full text-sm border p-2 rounded-xl dark:border-slate-700" />
            {sizeChartPreview && <img src={sizeChartPreview} alt="sizechart" className="w-20 h-20 object-cover mt-2 rounded-lg border" />}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Images (Optional - Max 4)</label>
          <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} className="w-full text-sm border p-2 rounded-xl dark:border-slate-700" />
          <div className="flex gap-3 mt-3 flex-wrap">
            {extraImagePreviews.map((src, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <img src={src} alt="extra" className="w-full h-full object-cover rounded-lg border" />
                <button type="button" onClick={() => removeExtraImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting && <Loader2 className="animate-spin" size={18} />}
            {submitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}