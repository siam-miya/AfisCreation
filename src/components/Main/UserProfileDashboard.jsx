'use client'
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiLogOut, FiEye, FiEyeOff } from "react-icons/fi";
import API from "@/utils/api";

const UserProfileDashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // অথেন্টিকেশন চেক এবং ইউজার লোডিং স্টেট
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeMenu, setActiveMenu] = useState("My Profile");
  const [loading, setLoading] = useState(false);
  
  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // লগইন করা আছে কি না চেক করা
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login"); // লগইন না থাকলে সরাসরি লগইন পেজে রিডাইরেক্ট করবে
      return;
    }

    setIsAuthorized(true);

    const tab = searchParams.get("tab");
    if (tab) setActiveMenu(tab);

    try {
      const userData = JSON.parse(storedUser);
      const nameParts = (userData.name || userData.firstName || "").split(" ");
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || userData.lastName || "";

      setFormData((prev) => ({
        ...prev,
        firstName: fName,
        lastName: lName,
        email: userData.email || "",
        address: userData.address || "",
      }));
    } catch (error) {
      console.error("Failed to load user data from storage:", error);
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          toast.error("Please enter your current password!");
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New passwords do not match!");
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          toast.error("New password must be at least 6 characters!");
          setLoading(false);
          return;
        }

        await API.put("/auth/change-password", {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      const updatedUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        address: formData.address,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userStateChanged"));

      toast.success("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userStateChanged"));
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  // অথারাইজেশন চেক না হওয়া পর্যন্ত লোডিং স্পিনার দেখাবে, ফলে উইদাউট অ্যাকাউন্টে পেজ দেখা যাবে না
  if (!isAuthorized) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#eb6e1b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto px-4 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Menu */}
        <div className="flex flex-col justify-between space-y-6 md:min-h-[400px]">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-black mb-2">Manage My Account</h3>
              <ul className="pl-4 space-y-2 text-sm text-gray-500">
                <li
                  onClick={() => setActiveMenu("My Profile")}
                  className={`cursor-pointer transition-colors ${
                    activeMenu === "My Profile" ? "text-[#eb6e1b] font-medium" : "hover:text-black"
                  }`}
                >
                  My Profile
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">My Orders</h3>
              <ul className="pl-4 space-y-2 text-sm text-gray-500">
                <li onClick={() => setActiveMenu("My Returns")} className="cursor-pointer hover:text-black">My Returns</li>
                <li onClick={() => setActiveMenu("My Cancellations")} className="cursor-pointer hover:text-black">My Cancellations</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer w-full"
            >
              <FiLogOut className="text-lg" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 bg-white p-6 md:p-10 rounded shadow-sm border border-gray-50">
          {activeMenu === "My Profile" && (
            <>
              <h2 className="text-xl font-medium text-black mb-6">Edit Your Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-100 px-4 py-3 text-sm rounded outline-none focus:ring-1 focus:ring-[#eb6e1b]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-100 px-4 py-3 text-sm rounded outline-none focus:ring-1 focus:ring-[#eb6e1b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-gray-200 px-4 py-3 text-sm rounded outline-none cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className="w-full bg-gray-100 px-4 py-3 text-sm rounded outline-none focus:ring-1 focus:ring-[#eb6e1b]"
                    />
                  </div>
                </div>

                {/* Password Changes Section */}
                <div className="space-y-4 pt-2">
                  <label className="block text-sm font-medium text-black">Password Changes</label>
                  
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Current Password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-100 px-4 py-3 text-sm rounded outline-none focus:ring-1 focus:ring-[#eb6e1b]"
                    />
                    <span
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                    >
                      {showCurrentPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-100 px-4 py-3 text-sm rounded outline-none focus:ring-1 focus:ring-[#eb6e1b]"
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                    >
                      {showNewPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-100 px-4 py-3 text-sm rounded outline-none focus:ring-1 focus:ring-[#eb6e1b]"
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                    >
                      {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end items-center space-x-6 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#eb6e1b] cursor-pointer text-white px-8 py-3 text-sm font-medium rounded hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center min-w-[130px]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const UserProfileDashboard = () => (
  <Suspense fallback={<div className="text-center py-20 font-poppins">Loading Profile...</div>}>
    <UserProfileDashboardContent />
  </Suspense>
);

export default UserProfileDashboard;