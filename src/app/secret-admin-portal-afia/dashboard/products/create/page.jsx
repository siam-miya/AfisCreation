'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, X, Check } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  // --------------------------------------------------
  // COLOR STRUCTURE
  //
  // imageIndexes:
  // -1 = thumbnail
  //  0 = first extra image
  //  1 = second extra image
  //  2 = third extra image
  // --------------------------------------------------
  const [colors, setColors] = useState([
    {
      name: '',
      code: '#000000',
      imageIndexes: [],
    },
  ]);

  const [sizes, setSizes] = useState(['']);

  // --------------------------------------------------
  // FETCH CATEGORIES
  // --------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const res = await fetch(
          `${apiUrl}/api/v1/categories/all`
        );

        if (!res.ok) {
          throw new Error(
            `Server returned status: ${res.status}`
          );
        }

        const result = await res.json();

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          setCategories(result.data);
        } else if (Array.isArray(result)) {
          setCategories(result);
        }
      } catch (error) {
        console.error(
          'Error fetching categories:',
          error
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // --------------------------------------------------
  // BASIC HANDLERS
  // --------------------------------------------------

  const handleTitleChange = (e) => {
    const title = e.target.value;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title,
      slug,
      metaTitle: prev.metaTitle || title,
    }));
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  // --------------------------------------------------
  // THUMBNAIL
  // --------------------------------------------------

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(
      URL.createObjectURL(file)
    );
  };

  // --------------------------------------------------
  // EXTRA IMAGES
  // --------------------------------------------------

  const handleExtraImagesChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    if (
      extraImagePreviews.length +
        files.length >
      4
    ) {
      alert(
        'সর্বোচ্চ ৪টি অতিরিক্ত ছবি আপলোড করা যাবে।'
      );

      e.target.value = '';
      return;
    }

    setExtraImages((prev) => [
      ...prev,
      ...files,
    ]);

    setExtraImagePreviews((prev) => [
      ...prev,
      ...files.map((file) =>
        URL.createObjectURL(file)
      ),
    ]);

    e.target.value = '';
  };

  // --------------------------------------------------
  // REMOVE EXTRA IMAGE
  // --------------------------------------------------

  const removeExtraImage = (index) => {
    setExtraImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setExtraImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    // Extra image delete হলে শুধু extra image
    // indexes update হবে।
    //
    // Thumbnail = -1 হওয়ায় সেটাতে কোনো
    // পরিবর্তন হবে না।
    setColors((prev) =>
      prev.map((color) => ({
        ...color,

        imageIndexes: (
          color.imageIndexes || []
        )
          .filter(
            (imageIndex) =>
              imageIndex !== index
          )
          .map((imageIndex) =>
            imageIndex > index
              ? imageIndex - 1
              : imageIndex
          ),
      }))
    );
  };

  // --------------------------------------------------
  // COLOR HANDLERS
  // --------------------------------------------------

  const handleColorChange = (
    index,
    field,
    value
  ) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === index
          ? {
              ...color,
              [field]: value,
            }
          : color
      )
    );
  };

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      {
        name: '',
        code: '#000000',
        imageIndexes: [],
      },
    ]);
  };

  const removeColor = (index) => {
    setColors((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // --------------------------------------------------
  // COLOR IMAGE SELECT / UNSELECT
  //
  // -1 = thumbnail
  //  0 = extra image 1
  //  1 = extra image 2
  // --------------------------------------------------

  const toggleColorImage = (
    colorIndex,
    imageIndex
  ) => {
    setColors((prev) =>
      prev.map((color, index) => {
        if (index !== colorIndex) {
          return color;
        }

        const currentIndexes =
          Array.isArray(
            color.imageIndexes
          )
            ? color.imageIndexes
            : [];

        const alreadySelected =
          currentIndexes.includes(
            imageIndex
          );

        return {
          ...color,

          imageIndexes:
            alreadySelected
              ? currentIndexes.filter(
                  (item) =>
                    item !== imageIndex
                )
              : [
                  ...currentIndexes,
                  imageIndex,
                ],
        };
      })
    );
  };

  // --------------------------------------------------
  // SIZE HANDLERS
  // --------------------------------------------------

  const handleSizeChange = (
    index,
    value
  ) => {
    const updated = [...sizes];

    updated[index] = value;

    setSizes(updated);
  };

  const addSize = () => {
    setSizes((prev) => [
      ...prev,
      '',
    ]);
  };

  const removeSize = (index) => {
    setSizes((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = new FormData();

      // ---------------------------------------------
      // FORM DATA
      // ---------------------------------------------

      Object.keys(formData).forEach(
        (key) => {
          data.append(
            key,
            formData[key]
          );
        }
      );

      // ---------------------------------------------
      // COLORS
      // ---------------------------------------------

      const filteredColors =
        colors
          .filter(
            (color) =>
              color.name &&
              color.name.trim() !== ''
          )
          .map((color) => ({
            name: color.name.trim(),

            code: color.code
              ? color.code
                  .trim()
                  .toUpperCase()
              : '#000000',

            // -1 = thumbnail
            // 0,1,2... = extra images
            imageIndexes:
              Array.isArray(
                color.imageIndexes
              )
                ? color.imageIndexes
                : [],
          }));

      // ---------------------------------------------
      // SIZES
      // ---------------------------------------------

      const filteredSizes =
        sizes.filter(
          (size) =>
            size &&
            size.trim() !== ''
        );

      data.append(
        'colors',
        JSON.stringify(
          filteredColors
        )
      );

      data.append(
        'sizes',
        JSON.stringify(
          filteredSizes
        )
      );

      // ---------------------------------------------
      // THUMBNAIL
      // ---------------------------------------------

      if (thumbnailFile) {
        data.append(
          'thumbnail',
          thumbnailFile
        );
      }

      // ---------------------------------------------
      // EXTRA IMAGES
      // ---------------------------------------------

      extraImages.forEach(
        (file) => {
          data.append(
            'images',
            file
          );
        }
      );

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:5000';

      const res = await fetch(
        `${apiUrl}/api/products`,
        {
          method: 'POST',
          body: data,
        }
      );

      const result =
        await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            'Failed to create product'
        );
      }

      setSuccessMsg(
        'Product added successfully!'
      );

      setTimeout(() => {
        router.push(
          '/secret-admin-portal-afia/dashboard/products'
        );
      }, 1200);
    } catch (err) {
      console.error(
        'Create product error:',
        err
      );

      setErrorMsg(
        err.message ||
          'Something went wrong'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // TABS
  // --------------------------------------------------

  const tabs = [
    {
      id: 'basics',
      label: 'Basics',
    },
    {
      id: 'images',
      label: 'Images',
    },
    {
      id: 'pricing',
      label: 'Pricing & Stock',
    },
    {
      id: 'variants',
      label: 'Colours & Variants',
    },
    {
      id: 'display',
      label: 'Display & SEO',
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto bg-slate-900 rounded-2xl shadow-xl border border-slate-800 text-white font-poppins">

      {/* HEADER */}

      <div className="mb-6 border-b border-slate-800 pb-4">

        <h2 className="text-2xl font-bold">
          Create Product
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Add a new product to your
          store catalogue.
        </p>

      </div>

      {/* ERROR */}

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/35 text-rose-400 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {/* SUCCESS */}

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 rounded-xl text-sm">
          {successMsg}
        </div>
      )}

      {/* NAVIGATION TABS */}

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              setActiveTab(tab.id)
            }
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ==================================================
            BASICS
        ================================================== */}

        {activeTab === 'basics' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Name *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={
                    handleTitleChange
                  }
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Product Name"
                />

              </div>

              {/* SLUG */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Slug *
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800/50 border-slate-700 text-slate-400 text-sm"
                  placeholder="product-url-slug"
                />

              </div>

            </div>

            {/* CATEGORY / SKU / BRAND */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                >

                  <option value="">
                    -- Choose Category --
                  </option>

                  {categories.map(
                    (cat) => {
                      const subCategories =
                        cat.subcategories ||
                        cat.children ||
                        [];

                      return (
                        <optgroup
                          key={
                            cat._id ||
                            cat.name
                          }
                          label={`📁 ${cat.name} (Main)`}
                        >

                          <option
                            value={
                              cat.name
                            }
                          >
                            {cat.name}{' '}
                            (Main)
                          </option>

                          {subCategories.map(
                            (sub) => {
                              const subName =
                                typeof sub ===
                                'string'
                                  ? sub
                                  : sub.name ||
                                    sub.title;

                              return (
                                <option
                                  key={
                                    sub._id ||
                                    subName
                                  }
                                  value={
                                    subName
                                  }
                                >
                                  &nbsp;&nbsp;&nbsp;&nbsp;╰─{' '}
                                  {subName}
                                </option>
                              );
                            }
                          )}

                        </optgroup>
                      );
                    }
                  )}

                </select>

              </div>

              {/* SKU */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. SKU-101"
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />

              </div>

              {/* BRAND */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={
                    handleChange
                  }
                  placeholder="Brand name (Optional)"
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />

              </div>

            </div>

            {/* SHORT DESCRIPTION */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Short Description
              </label>

              <textarea
                name="shortDescription"
                value={
                  formData.shortDescription
                }
                onChange={
                  handleChange
                }
                rows="2"
                className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                placeholder="Used on product cards..."
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Description *
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                rows="4"
                required
                className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                placeholder="Write detailed product specifications..."
              />

            </div>

          </div>
        )}

        {/* ==================================================
            IMAGES
        ================================================== */}

        {activeTab === 'images' && (
          <div className="space-y-6">

            {/* THUMBNAIL */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Thumbnail Image (Main) *
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleThumbnailChange
                }
                className="w-full text-sm border border-slate-700 p-2 rounded-xl bg-slate-800"
              />

              {thumbnailPreview && (
                <div className="mt-3 flex items-center gap-3">

                  <img
                    src={thumbnailPreview}
                    alt="thumb"
                    className="w-24 h-24 object-cover rounded-lg border border-orange-500"
                  />

                  <div>
                    <p className="text-xs text-orange-400 font-medium">
                      Product Thumbnail
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      This image will be shown
                      first on the Product
                      Details page.
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* EXTRA IMAGES */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Additional Images (Max 4)
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleExtraImagesChange
                }
                className="w-full text-sm border border-slate-700 p-2 rounded-xl bg-slate-800"
              />

              <div className="flex gap-3 mt-3 flex-wrap">

                {extraImagePreviews.map(
                  (
                    src,
                    idx
                  ) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20"
                    >

                      <img
                        src={src}
                        alt={`extra-${idx}`}
                        className="w-full h-full object-cover rounded-lg border border-slate-700"
                      />

                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeExtraImage(
                            idx
                          )
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X
                          size={12}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>

              {extraImagePreviews.length >
                0 && (
                <p className="text-xs text-slate-500 mt-3">
                  These images can be
                  assigned to specific
                  colours from the
                  <span className="text-orange-400">
                    {' '}
                    Colours & Variants
                  </span>{' '}
                  tab.
                </p>
              )}

            </div>

          </div>
        )}

        {/* ==================================================
            PRICING
        ================================================== */}

        {activeTab === 'pricing' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* PRICE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Price (৳) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="1500"
                />

              </div>

              {/* DISCOUNT PRICE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Compare-at price (৳)
                </label>

                <input
                  type="number"
                  name="discountPrice"
                  value={
                    formData.discountPrice
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="1200"
                />

              </div>

              {/* COST PRICE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Cost price (৳)
                </label>

                <input
                  type="number"
                  name="costPrice"
                  value={
                    formData.costPrice
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="1000"
                />

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* STOCK */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Stock Quantity *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                  placeholder="50"
                />

              </div>

              {/* STOCK STATUS */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Stock Status *
                </label>

                <select
                  name="stockStatus"
                  value={
                    formData.stockStatus
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                >

                  <option value="in-stock">
                    In stock
                  </option>

                  <option value="out-of-stock">
                    Out of stock
                  </option>

                </select>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            COLOURS & SIZES
        ================================================== */}

        {activeTab === 'variants' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ==================================================
                  COLORS
              ================================================== */}

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">

                <label className="block text-sm font-semibold mb-3">
                  Product Colors
                </label>

                {colors.map(
                  (
                    color,
                    idx
                  ) => (
                    <div
                      key={idx}
                      className="mb-5 p-3 rounded-lg border border-slate-700 bg-slate-900"
                    >

                      {/* COLOR NAME + CODE */}

                      <div className="flex gap-2 items-center">

                        {/* COLOR PICKER */}

                        <input
                          type="color"
                          value={
                            color.code ||
                            '#000000'
                          }
                          onChange={(e) =>
                            handleColorChange(
                              idx,
                              'code',
                              e.target.value
                            )
                          }
                          className="w-10 h-10 rounded border border-slate-700 bg-slate-800 cursor-pointer p-1"
                        />

                        {/* COLOR NAME */}

                        <input
                          type="text"
                          value={
                            color.name
                          }
                          onChange={(e) =>
                            handleColorChange(
                              idx,
                              'name',
                              e.target.value
                            )
                          }
                          className="flex-1 border rounded p-2 text-sm bg-slate-800 border-slate-700"
                          placeholder="Color Name (e.g. Black)"
                        />

                        {/* HEX CODE */}

                        <input
                          type="text"
                          value={
                            color.code
                          }
                          onChange={(e) =>
                            handleColorChange(
                              idx,
                              'code',
                              e.target.value
                            )
                          }
                          className="w-24 border rounded p-2 text-sm bg-slate-800 border-slate-700 uppercase"
                          placeholder="#000000"
                        />

                        {/* DELETE COLOR */}

                        {colors.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeColor(
                                idx
                              )
                            }
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2
                              size={18}
                            />
                          </button>
                        )}

                      </div>

                      {/* ==================================================
                          COLOR IMAGE ASSIGNMENT
                      ================================================== */}

                      {(thumbnailPreview ||
                        extraImagePreviews.length >
                          0) && (
                        <div className="mt-4">

                          <p className="text-xs text-slate-400 mb-3">
                            Select image(s)
                            for{' '}
                            <span className="text-white font-semibold">
                              {color.name ||
                                `Color ${
                                  idx +
                                  1
                                }`}
                            </span>
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {/* ==================================================
                                THUMBNAIL IMAGE
                            ================================================== */}

                            {thumbnailPreview && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleColorImage(
                                    idx,
                                    -1
                                  )
                                }
                                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                  (
                                    color.imageIndexes ||
                                    []
                                  ).includes(-1)
                                    ? 'border-orange-500 ring-2 ring-orange-500/30'
                                    : 'border-orange-400/60 hover:border-orange-400'
                                }`}
                              >

                                <img
                                  src={
                                    thumbnailPreview
                                  }
                                  alt="thumbnail"
                                  className="w-full h-full object-cover"
                                />

                                {/* THUMBNAIL LABEL */}

                                <span className="absolute top-0 left-0 right-0 bg-orange-500/90 text-white text-[9px] px-1 py-1 text-center font-semibold">
                                  THUMBNAIL
                                </span>

                                {/* SELECTED */}

                                {(
                                  color.imageIndexes ||
                                  []
                                ).includes(-1) && (
                                  <span className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">

                                    <span className="bg-orange-500 text-white rounded-full p-1">

                                      <Check
                                        size={
                                          12
                                        }
                                      />

                                    </span>

                                  </span>
                                )}

                              </button>
                            )}

                            {/* ==================================================
                                EXTRA IMAGES
                            ================================================== */}

                            {extraImagePreviews.map(
                              (
                                src,
                                imageIndex
                              ) => {

                                const selected =
                                  (
                                    color.imageIndexes ||
                                    []
                                  ).includes(
                                    imageIndex
                                  );

                                return (
                                  <button
                                    key={
                                      imageIndex
                                    }
                                    type="button"
                                    onClick={() =>
                                      toggleColorImage(
                                        idx,
                                        imageIndex
                                      )
                                    }
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                      selected
                                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                                        : 'border-slate-700 hover:border-slate-500'
                                    }`}
                                  >

                                    <img
                                      src={src}
                                      alt={`color-${imageIndex}`}
                                      className="w-full h-full object-cover"
                                    />

                                    {/* IMAGE NUMBER */}

                                    <span className="absolute bottom-0 left-0 bg-black/70 text-white text-[9px] px-1">
                                      #
                                      {imageIndex +
                                        1}
                                    </span>

                                    {/* SELECTED */}

                                    {selected && (
                                      <span className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">

                                        <span className="bg-orange-500 text-white rounded-full p-1">

                                          <Check
                                            size={
                                              12
                                            }
                                          />

                                        </span>

                                      </span>
                                    )}

                                  </button>
                                );
                              }
                            )}

                          </div>

                          {/* SELECTED COUNT */}

                          <p className="text-[10px] text-slate-500 mt-2">

                            {(
                              color.imageIndexes ||
                              []
                            ).length >
                            0
                              ? `${
                                  (
                                    color.imageIndexes ||
                                    []
                                  ).length
                                } image(s) selected`
                              : 'No image selected for this color.'}

                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Thumbnail can also
                            be assigned to this
                            color.
                          </p>

                        </div>
                      )}

                    </div>
                  )
                )}

                {/* ADD COLOR */}

                <button
                  type="button"
                  onClick={
                    addColor
                  }
                  className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-1"
                >

                  <Plus
                    size={14}
                  />

                  Add More Color

                </button>

              </div>

              {/* ==================================================
                  SIZES
              ================================================== */}

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">

                <label className="block text-sm font-semibold mb-2">
                  Product Sizes
                </label>

                {sizes.map(
                  (
                    size,
                    idx
                  ) => (
                    <div
                      key={idx}
                      className="flex gap-2 mb-2 items-center"
                    >

                      <input
                        type="text"
                        value={
                          size
                        }
                        onChange={(e) =>
                          handleSizeChange(
                            idx,
                            e.target.value
                          )
                        }
                        className="w-full border rounded p-2 text-sm bg-slate-800 border-slate-700"
                        placeholder="e.g. Medium"
                      />

                      {sizes.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSize(
                              idx
                            )
                          }
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      )}

                    </div>
                  )
                )}

                <button
                  type="button"
                  onClick={
                    addSize
                  }
                  className="text-xs font-semibold text-orange-500 flex items-center gap-1 mt-1"
                >

                  <Plus
                    size={14}
                  />

                  Add More Size

                </button>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            DISPLAY & SEO
        ================================================== */}

        {activeTab === 'display' && (
          <div className="space-y-6">

            {/* PRODUCT PLACEMENT */}

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">

              <label className="block text-sm font-semibold mb-3">
                Product Placement & Sections
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                {/* FLASH SALE */}

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    name="isFlashSale"
                    checked={
                      formData.isFlashSale
                    }
                    onChange={
                      handleChange
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />

                  <span>
                    Flash Sale
                  </span>

                </label>

                {/* BEST SELLING */}

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    name="isBestSelling"
                    checked={
                      formData.isBestSelling
                    }
                    onChange={
                      handleChange
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />

                  <span>
                    Best Selling
                  </span>

                </label>

                {/* NEW ARRIVAL */}

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={
                      formData.isNewArrival
                    }
                    onChange={
                      handleChange
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />

                  <span>
                    New Arrival
                  </span>

                </label>

              </div>

            </div>

            {/* SEO */}

            <div className="space-y-4 pt-2">

              <h3 className="text-md font-semibold text-slate-300">
                Search Engines (SEO)
              </h3>

              {/* META TITLE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Meta title
                </label>

                <input
                  type="text"
                  name="metaTitle"
                  value={
                    formData.metaTitle
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Falls back to the product name."
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />

              </div>

              {/* META DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Meta description
                </label>

                <textarea
                  name="metaDescription"
                  value={
                    formData.metaDescription
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                  placeholder="Falls back to the short description."
                  className="w-full px-4 py-2.5 border rounded-xl bg-slate-800 border-slate-700 text-sm"
                />

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            SUBMIT
        ================================================== */}

        <div className="flex justify-end pt-6 border-t border-slate-800">

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >

            {submitting && (
              <Loader2
                className="animate-spin"
                size={18}
              />
            )}

            {submitting
              ? 'Publishing...'
              : 'Create Product'}

          </button>

        </div>

      </form>

    </div>
  );
}