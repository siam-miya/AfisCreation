'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, Loader2, Zap } from 'lucide-react';

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/products`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else if (Array.isArray(result)) {
        setProducts(result);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMsg("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Flash Sale চেকবক্স টগল করার ফাংশন
  const handleFlashSaleToggle = async (id, currentStatus) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // FormData তৈরি করা কারণ ব্যাকএন্ডে upload.fields মিডলওয়্যার ব্যবহার করা হয়েছে
      const formData = new FormData();
      formData.append("isFlashSale", !currentStatus);

      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'PUT',
        body: formData, // অথবা JSON আকারে পাঠাতে পারিস যদি ব্যাকএন্ড JSON সাপোর্ট করে
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update flash sale status");

      // لوকেল স্টেট আপডেট করা
      setProducts(products.map(p => p._id === id ? { ...p, isFlashSale: !currentStatus } : p));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Failed to delete product");
      
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 font-poppins text-black dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Product Management (CRUD)</h2>
          <p className="text-sm text-slate-500 mt-1">Manage store items, toggle Flash Sales, update, or delete products.</p>
        </div>
        <Link 
          href="/secret-admin-portal-afia/dashboard/products/create" 
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition flex items-center gap-2 text-sm shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {errorMsg && <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/30 text-rose-500 rounded-xl text-sm">{errorMsg}</div>}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm">No products found. Click Add New Product to create one.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 uppercase">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">
                  <span className="flex items-center justify-center gap-1 text-orange-500">
                    <Zap size={14} /> Flash Sale
                  </span>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <img 
                      src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/50'} 
                      alt={product.title} 
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" 
                    />
                  </td>
                  <td className="py-3 px-4 font-medium max-w-xs truncate">{product.title}</td>
                  <td className="py-3 px-4 text-slate-500">{product.category}</td>
                  <td className="py-3 px-4">৳{product.discountPrice || product.price}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  
                  {/* Flash Sale Checkbox Column */}
                  <td className="py-3 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={product.isFlashSale || false} 
                      onChange={() => handleFlashSaleToggle(product._id, product.isFlashSale)}
                      className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
                      title="Check to include in Flash Sales"
                    />
                  </td>

                  {/* Actions Column (Edit & Delete) */}
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link 
                      href={`/secret-admin-portal-afia/dashboard/products/edit/${product._id}`}
                      className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition inline-flex items-center justify-center"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition inline-flex items-center justify-center"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}