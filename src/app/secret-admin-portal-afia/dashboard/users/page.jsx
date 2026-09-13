'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '@/utils/api';
import { FiUser, FiShield, FiUserCheck, FiRefreshCw } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে কারেন্ট ইউজারের রোল জানা
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUserRole(parsed.role || '');
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ✅ সঠিক URL: /v1/auth/users
      const { data } = await API.get('/v1/auth/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'ইউজারদের তথ্য ফেচ করতে ব্যর্থ হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (currentUserRole !== 'admin') {
      toast.error('শুধুমাত্র Admin ইউজার রোল পরিবর্তন করতে পারবেন!');
      return;
    }

    setUpdatingId(userId);
    try {
      // ✅ সঠিক URL: /v1/auth/users/${userId}/role
      const { data } = await API.put(`/v1/auth/users/${userId}/role`, { role: newRole });
      if (data.success) {
        toast.success(data.message || 'ইউজার রোল সফলভাবে আপডেট করা হয়েছে!');
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'রোল পরিবর্তন করতে ব্যর্থ হয়েছে!');
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <FiShield size={12} /> Admin
          </span>
        );
      case 'moderator':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <FiUserCheck size={12} /> Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <FiUser size={12} /> Customer
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-poppins">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            {currentUserRole === 'admin'
              ? 'সকল ইউজারের তালিকা দেখুন এবং রোল আপডেট করুন'
              : 'সকল কাস্টমার ও মডারেটরদের তালিকা'}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* User Table / Loader */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#eb6e1b] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 border-b border-gray-100">User Info</th>
                <th className="p-4 border-b border-gray-100">Email</th>
                <th className="p-4 border-b border-gray-100">Role</th>
                <th className="p-4 border-b border-gray-100">Joined Date</th>
                <th className="p-4 border-b border-gray-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#eb6e1b]/10 text-[#eb6e1b] font-bold text-sm flex items-center justify-center">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400 capitalize">ID: {user._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4 text-xs text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      {currentUserRole === 'admin' ? (
                        <div className="inline-block relative">
                          <select
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#eb6e1b] cursor-pointer disabled:opacity-50 font-medium text-gray-700"
                          >
                            <option value="customer">Customer</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No Permission</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    কোনো ইউজার পাওয়া যায়নি!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;