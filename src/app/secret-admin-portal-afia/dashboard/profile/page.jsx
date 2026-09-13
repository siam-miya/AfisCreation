'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiMail, FiMapPin, FiSave, FiLogOut, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminProfilePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    
    // Password visibility toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Admin state
    const [admin, setAdmin] = useState({
        name: '',
        email: '',
        address: '',
        role: 'Super Admin',
        avatar: ''
    });

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const storedAdmin = localStorage.getItem('adminUser') || localStorage.getItem('user');
        if (storedAdmin) {
            try {
                const parsed = JSON.parse(storedAdmin);
                setAdmin({
                    name: parsed.name || '',
                    email: parsed.email || '',
                    address: parsed.address || '',
                    role: parsed.role || 'Super Admin',
                    avatar: parsed.picture || parsed.avatar || parsed.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'
                });
            } catch (err) {
                console.error("Failed to parse admin data", err);
            }
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAdmin(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        localStorage.setItem('adminUser', JSON.stringify(admin));
        localStorage.setItem('user', JSON.stringify(admin));
        toast.success("Profile updated successfully!");
        window.dispatchEvent(new Event('userLogin'));
    };

    // ব্যাকএন্ডে API কলের মাধ্যমে পাসওয়ার্ড আপডেট হ্যান্ডলার
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New password and confirm password do not match!");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/v1/auth/change-password', { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // কুকি পাঠানোর জন্য এটি অত্যন্ত জরুরি
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || "Password changed successfully!");
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(data.message || "Failed to update password!");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Something went wrong. Please check your connection!");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('user');
        toast.success("Logged out successfully!");
        router.push('/secret-admin-portal-afia/login');
    };

    return (
        <div className="p-6 max-w-5xl mx-auto font-poppins">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#eb6e1b] shadow-md flex-shrink-0">
                        <img src={admin.avatar} alt="Admin" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{admin.name || 'Admin User'}</h1>
                        <span className="text-xs text-gray-500 font-medium bg-orange-100 text-[#eb6e1b] inline-block px-2.5 py-0.5 rounded-full mt-1">
                            {admin.role}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                    <FiLogOut size={18} />
                    <span>Logout Admin</span>
                </button>
            </div>

            <div className="flex gap-4 border-b border-gray-200 dark:border-slate-800 mb-6">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                        activeTab === 'profile' ? 'border-[#eb6e1b] text-[#eb6e1b]' : 'border-transparent text-gray-500 dark:text-slate-400'
                    }`}
                >
                    <FiUser size={16} />
                    <span>Profile Information</span>
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                        activeTab === 'security' ? 'border-[#eb6e1b] text-[#eb6e1b]' : 'border-transparent text-gray-500 dark:text-slate-400'
                    }`}
                >
                    <FiLock size={16} />
                    <span>Login & Security</span>
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Edit Personal Details</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUser size={18} /></span>
                                    <input
                                        type="text"
                                        value={admin.name}
                                        onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-white rounded-xl pl-10 pr-4 py-3 focus:outline-[#eb6e1b]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiMail size={18} /></span>
                                    <input
                                        type="email"
                                        value={admin.email}
                                        disabled
                                        className="w-full bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-slate-400 rounded-xl pl-10 pr-4 py-3 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiMapPin size={18} /></span>
                                    <input
                                        type="text"
                                        placeholder="Enter your address"
                                        value={admin.address}
                                        onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-white rounded-xl pl-10 pr-4 py-3 focus:outline-[#eb6e1b]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Upload Profile Picture</label>
                                <label className="w-full flex items-center justify-between bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-slate-400 rounded-xl px-4 py-3 cursor-pointer hover:border-[#eb6e1b]">
                                    <span className="flex items-center gap-2 truncate">
                                        <FiUpload size={18} className="text-[#eb6e1b]" /> Choose image...
                                    </span>
                                    <span className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs px-3 py-1 rounded-lg">Browse</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="flex items-center gap-2 bg-[#eb6e1b] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-all cursor-pointer shadow-md">
                                <FiSave size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Change Password</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Secure your account by updating your password regularly.</p>
                    
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-xl">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-[#eb6e1b]"
                                    required
                                />
                                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                                    {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-[#eb6e1b]"
                                    required
                                />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                                    {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-[#eb6e1b]"
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#eb6e1b] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-all cursor-pointer shadow-md disabled:opacity-50"
                            >
                                <FiLock size={18} />
                                <span>{loading ? "Updating..." : "Update Password"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminProfilePage;