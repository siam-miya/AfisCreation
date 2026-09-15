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

  // বর্তমান কোন ট্যাবে আছেন তা ট্র্যাক করার জন্য
  const [activeTab, setActiveTab] = useState('basics');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sku: '',
    brand: '',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    costPrice: '',
    stock: '',
    category: '',
    stockStatus: 'in-stock',
    isFlashSale: false,
    isBestSelling: false,
    isNewArrival: false,
    isHotProductBanner: false,
    isHotProductSection2: false,
    isExploreProduct: true,
    metaTitle: '',
    metaDescription: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [extraImages, setExtraImages] = useState([]);
  const [extraImagePreviews, setExtraImagePreviews] = useState([]);
  
  // এখানে কালারের স্ট্রাকচার ঠিক করা হলো যাতে নাম এবং কোড সঠিকভাবে যায়
  const [colors, setColors] = useState([{ name: '', code: '#000000' }]);
  const [sizes, setSizes] = useState(['']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/v1/categories/all`);
        if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
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
    setFormData({ ...formData, title, slug, metaTitle: formData.metaTitle || title });
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

  const addColor = () => setColors([...colors, { name: '', code: '#000000' }]);
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

      // শুধুমাত্র নাম আছে এমন কালারগুলো ফিল্টার করা হচ্ছে এবং প্রতিটি অবজেক্ট নিশ্চিত করা হচ্ছে
      const filteredColors = colors
        .filter(c => c.name && c.name.trim() !== '')
        .map(c => ({
          name: c.name.trim(),
          code: c.code ? c.code.trim() : '#000000'
        }));

      const filteredSizes = sizes.filter(s => s && s.trim() !== '');

      // ব্যাকএন্ড যাতে সহজে রিসিভ করতে পারে সেজন্য JSON.stringify করে পাঠানো হচ্ছে
      data.append('colors', JSON.stringify(filteredColors));
      data.append('sizes', JSON.stringify(filteredSizes));

      if (thumbnailFile) data.append('thumbnail', thumbnailFile);
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

  const tabs = [
    { id: 'basics', label: 'Basics' },
    { id: 'images', label: 'Images' },
    { id: 'pricing', label: 'Pricing & Stock' },
    { id: 'variants', label: 'Colours & Variants' },
    { id: 'display', label: 'Display & SEO' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto bg-slate-900 rounded-2xl shadow-xl border border-slate-800 text-white font-poppins">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold">Create Product</h2>
        <p className="text-sm text-slate-400 mt-1">Add a new product to your store catalogue.</p>
      </div>

      {errorMsg && <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/35 text-rose-400 rounded-xl text-sm">{errorMsg}</div>}
      {successMsg && <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 rounded-xl text-sm">{successMsg}</div>}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Basics Tab */}
        {activeTab === 'basics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Product Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800/50 border-slate-700 text-slate-400 text-sm"
                  placeholder="product-url-slug"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => {
                    const subCategories = cat.subcategories || cat.children || [];
                    return (
                      <optgroup key={cat._id || cat.name} label={`📁 ${cat.name} (Main)`}>
                        <option value={cat.name}>{cat.name} (Main)</option>
                        {subCategories.map((sub) => {
                          const subName = typeof sub === 'string' ? sub : (sub.name || sub.title);
                          return (
                            <option key={sub._id || subName} value={subName}>
                              &nbsp;&nbsp;&nbsp;&nbsp;╰─ {subName}
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. SKU-101"
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Brand name (Optional)"
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                placeholder="Used on product cards..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                placeholder="Write detailed product specifications..."
              ></textarea>
            </div>
          </div>
        )}

        {/* 2. Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Image (Main) *</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full text-sm border border-slate-700 p-2 rounded-xl bg-slate-800" />
              {thumbnailPreview && <img src={thumbnailPreview} alt="thumb" className="w-24 h-24 object-cover mt-3 rounded-lg border border-slate-700" />}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Images (Max 4)</label>
              <input type="file" accept="image/*" multiple onChange={handleExtraImagesChange} className="w-full text-sm border border-slate-700 p-2 rounded-xl bg-slate-800" />
              <div className="flex gap-3 mt-3 flex-wrap">
                {extraImagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img src={src} alt="extra" className="w-full h-full object-cover rounded-lg border border-slate-700" />
                    <button type="button" onClick={() => removeExtraImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Pricing & Stock Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (৳) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="1500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Compare-at price (৳)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cost price (৳)</label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock Status *</label>
                <select 
                  name="stockStatus"
                  value={formData.stockStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                >
                  <option value="in-stock">In stock</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. Colours & Variants Tab */}
        {activeTab === 'variants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Colors</label>
              {colors.map((color, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                    className="w-full border rounded p-2 text-sm bg-slate-800 border-slate-700"
                    placeholder="Color Name (e.g. Black)"
                  />
                  <input
                    type="text"
                    value={color.code}
                    onChange={(e) => handleColorChange(idx, 'code', e.target.value)}
                    className="w-24 border rounded p-2 text-sm bg-slate-800 border-slate-700"
                    placeholder="#000000"
                  />
                  {colors.length > 1 && <button type="button" onClick={() => removeColor(idx)} className="text-red-500"><Trash2 size={18} /></button>}
                </div>
              ))}
              <button type="button" onClick={addColor} className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-1">
                <Plus size={14} /> Add More Color
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Product Sizes</label>
              {sizes.map((size, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => handleSizeChange(idx, e.target.value)}
                    className="w-full border rounded p-2 text-sm bg-slate-800 border-slate-700"
                    placeholder="e.g. Medium"
                  />
                  {sizes.length > 1 && <button type="button" onClick={() => removeSize(idx)} className="text-red-500"><Trash2 size={18} /></button>}
                </div>
              ))}
              <button type="button" onClick={addSize} className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-1">
                <Plus size={14} /> Add More Size
              </button>
            </div>
          </div>
        )}

        {/* 5. Display & SEO Tab */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <label className="block text-sm font-semibold mb-3">Product Placement & Sections</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isFlashSale" checked={formData.isFlashSale} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded" />
                  <span>Flash Sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isBestSelling" checked={formData.isBestSelling} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded" />
                  <span>Best Selling</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded" />
                  <span>New Arrival</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-md font-semibold text-slate-300">Search Engines (SEO)</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Meta title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Falls back to the product name."
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meta description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Falls back to the short description."
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting && <Loader2 className="animate-spin" size={18} />}
            {submitting ? 'Publishing...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}