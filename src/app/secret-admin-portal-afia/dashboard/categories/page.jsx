'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, Trash2, FolderTree, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminCategories() {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const mainRes = await axios.get(`${API_BASE_URL}/api/v1/categories/main-categories`);
      if (mainRes.data.success) {
        setMainCategories(mainRes.data.data);
      }

      const allRes = await axios.get(`${API_BASE_URL}/api/v1/categories/all`);
      if (allRes.data.success) {
        setCategories(allRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation Check
    if (!parent && !icon) {
      return toast.warning('Main category icon is required!');
    }
    if (!name.trim()) {
      return toast.warning('Please provide a category name!');
    }

    const formData = new FormData();
    formData.append('name', name);
    if (icon) {
      formData.append('icon', icon);
    }
    if (parent && parent !== "") {
      formData.append('parent', parent);
    }

    try {
      setLoading(true);

      // 🟢 'Content-Type' ম্যানুয়ালি বাদ দিয়ে সরাসরি FormData পাঠানো হচ্ছে
      const res = await axios.post(`${API_BASE_URL}/api/v1/categories/create`, formData, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Category created successfully!');
        setName('');
        setParent('');
        setIcon(null);
        setIconPreview(null);
        if (document.getElementById('categoryIconInput')) {
          document.getElementById('categoryIconInput').value = '';
        }
        fetchData();
      }
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!confirm(`Are you sure to delete "${catName}"?`)) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/api/v1/categories/delete/${id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success('Category deleted successfully!');
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <div className="space-y-8 font-poppins pb-10">
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <FolderTree className="text-orange-400" size={28} />
          <span>Category & Subcategory Management</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">First create a Main Category, then select it to create Subcategories under it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl h-fit">
          <h2 className="text-lg font-semibold mb-4 text-orange-400 border-b border-slate-750 pb-3 flex items-center gap-2">
            <PlusCircle size={20} />
            <span>Add Category</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Parent Category (Optional)</label>
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="" className="bg-[#0f172a] text-white">-- None (Make Main Category) --</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="bg-[#0f172a] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">Leave blank to create a Main Category.</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics, Panjabi"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category Icon {parent ? '(Optional for Subcategory)' : '*'}
              </label>
              <input
                id="categoryIconInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
                required={!parent}
              />
              {iconPreview && (
                <div className="mt-3 flex items-center gap-3 bg-[#0f172a] p-2.5 rounded-xl border border-slate-700">
                  <img src={iconPreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-600" />
                  <span className="text-xs text-slate-300">Icon Selected</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <PlusCircle size={18} />
              <span>{loading ? 'Saving...' : 'Save Category'}</span>
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-slate-200">Category Structure</h2>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f172a]/60 text-slate-400 text-xs border-b border-slate-800 uppercase">
                  <th className="p-4">Icon</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-400">No categories found. Create a main category first!</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <React.Fragment key={cat._id}>
                      {/* Main Category */}
                      <tr className="hover:bg-[#162032] transition-colors">
                        <td className="p-4">
                          {cat.icon ? (
                            <img src={getImageUrl(cat.icon)} alt={cat.name} className="w-9 h-9 object-cover rounded-xl border border-slate-700" />
                          ) : (
                            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500"><ImageIcon size={18} /></div>
                          )}
                        </td>
                        <td className="p-4 font-bold text-white">{cat.name}</td>
                        <td className="p-4 text-slate-400 font-mono text-xs">{cat.slug}</td>
                        <td className="p-4">
                          <span className="bg-orange-500/10 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/20 font-medium">Main Category</span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDelete(cat._id, cat.name)} className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>

                      {/* Subcategories */}
                      {cat.subcategories && cat.subcategories.map((sub) => (
                        <tr key={sub._id} className="hover:bg-[#162032]/60 transition-colors bg-[#0f172a]/30">
                          <td className="p-4 pl-8">
                            {sub.icon ? (
                              <img src={getImageUrl(sub.icon)} alt={sub.name} className="w-7 h-7 object-cover rounded-lg border border-slate-700" />
                            ) : (
                              <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500"><ImageIcon size={14} /></div>
                            )}
                          </td>
                          <td className="p-4 pl-6 text-slate-300 flex items-center gap-2">
                            <span className="text-orange-400 font-mono">╰──</span> 
                            <span className="font-medium">{sub.name}</span>
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-xs">{sub.slug}</td>
                          <td className="p-4">
                            <span className="bg-slate-700/30 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-600/30">Subcategory</span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDelete(sub._id, sub.name)} className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}