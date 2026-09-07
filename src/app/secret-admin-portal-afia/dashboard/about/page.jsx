"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiUpload, FiSave, FiLoader } from "react-icons/fi";

const AboutAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    storyTitle: "",
    storyParagraphs: "",
    purposeTitle: "",
    purposeDescription: "",
    whatWeOfferTitle: "",
    offersList: "",
    whyChooseTitle: "",
    whyChooseList: "",
    promiseTitle: "",
    promiseDescription: "",
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ডাটাবেজ থেকে আগের ডাটা লোড করা
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/about`);
        const result = await res.json();

        if (result.success && result.data) {
          const data = result.data;
          setFormData({
            storyTitle: data.storyTitle || "",
            storyParagraphs: data.storyParagraphs ? data.storyParagraphs.join("\n") : "",
            purposeTitle: data.purposeTitle || "",
            purposeDescription: data.purposeDescription || "",
            whatWeOfferTitle: data.whatWeOfferTitle || "",
            offersList: data.offersList ? data.offersList.join("\n") : "",
            whyChooseTitle: data.whyChooseTitle || "",
            whyChooseList: data.whyChooseList ? data.whyChooseList.join("\n") : "",
            promiseTitle: data.promiseTitle || "",
            promiseDescription: data.promiseDescription || "",
          });

          if (data.aboutImage) {
            setImagePreview(
              data.aboutImage.startsWith("http")
                ? data.aboutImage
                : `${BASE_URL}${data.aboutImage}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [BASE_URL]);

  // ইনপুট হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ইমেজ সিলেক্ট হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার (FormData ব্যবহার করে)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("storyTitle", formData.storyTitle);
      dataToSend.append("purposeTitle", formData.purposeTitle);
      dataToSend.append("purposeDescription", formData.purposeDescription);
      dataToSend.append("whatWeOfferTitle", formData.whatWeOfferTitle);
      dataToSend.append("whyChooseTitle", formData.whyChooseTitle);
      dataToSend.append("promiseTitle", formData.promiseTitle);
      dataToSend.append("promiseDescription", formData.promiseDescription);

      // Newline দিয়ে টেক্সটগুলোকে অ্যারে হিসেবে প্রসেস করা
      const paragraphsArray = formData.storyParagraphs.split("\n").filter((p) => p.trim() !== "");
      const offersArray = formData.offersList.split("\n").filter((o) => o.trim() !== "");
      const whyChooseArray = formData.whyChooseList.split("\n").filter((w) => w.trim() !== "");

      dataToSend.append("storyParagraphs", JSON.stringify(paragraphsArray));
      dataToSend.append("offersList", JSON.stringify(offersArray));
      dataToSend.append("whyChooseList", JSON.stringify(whyChooseArray));

      if (imageFile) {
        dataToSend.append("aboutImage", imageFile);
      }

      const res = await fetch(`${BASE_URL}/api/about`, {
        method: "POST",
        body: dataToSend,
      });

      const result = await res.json();
      if (result.success) {
        alert("About page content updated successfully!");
      } else {
        alert("Failed to update: " + result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-3xl text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage About Page</h1>
          <p className="text-sm text-gray-500">
            Edit all content, icons text, and images for the main About page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition duration-200 disabled:opacity-50"
        >
          {saving ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiSave size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Story & Main Image */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            1. Main Banner & Our Story
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Section Title
                </label>
                <input
                  type="text"
                  name="storyTitle"
                  value={formData.storyTitle}
                  onChange={handleChange}
                  placeholder="e.g. Our Story"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Paragraphs (নতুন লাইনে লিখলে আলাদা প্যারাগ্রাফ হবে)
                </label>
                <textarea
                  name="storyParagraphs"
                  rows={6}
                  value={formData.storyParagraphs}
                  onChange={handleChange}
                  placeholder="Paragraph 1...&#10;Paragraph 2..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm leading-relaxed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Page Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] bg-gray-50 relative">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <FiUpload className="mx-auto text-3xl mb-2" />
                    <p className="text-xs">No image uploaded yet</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-3 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Info Cards Grid */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            2. Feature Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Purpose Box */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 text-sm">Our Purpose Card</h3>
              <input
                type="text"
                name="purposeTitle"
                value={formData.purposeTitle}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2 border rounded text-xs"
              />
              <textarea
                name="purposeDescription"
                rows={4}
                value={formData.purposeDescription}
                onChange={handleChange}
                placeholder="Description..."
                className="w-full p-2 border rounded text-xs"
              />
            </div>

            {/* What We Offer Box */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 text-sm">What We Offer Card</h3>
              <input
                type="text"
                name="whatWeOfferTitle"
                value={formData.whatWeOfferTitle}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2 border rounded text-xs"
              />
              <textarea
                name="offersList"
                rows={4}
                value={formData.offersList}
                onChange={handleChange}
                placeholder="প্রতি লাইনে ১টি পয়েন্ট লিখুন:&#10;Designer Abayas&#10;Hijabs & Niqabs"
                className="w-full p-2 border rounded text-xs"
              />
            </div>

            {/* Why Choose Us Box */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 text-sm">Why Choose Us Card</h3>
              <input
                type="text"
                name="whyChooseTitle"
                value={formData.whyChooseTitle}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2 border rounded text-xs"
              />
              <textarea
                name="whyChooseList"
                rows={4}
                value={formData.whyChooseList}
                onChange={handleChange}
                placeholder="প্রতি লাইনে ১টি পয়েন্ট লিখুন:&#10;Premium Fabric Quality&#10;Cash on Delivery"
                className="w-full p-2 border rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Our Promise */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            3. Bottom Banner (Our Promise)
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              name="promiseTitle"
              value={formData.promiseTitle}
              onChange={handleChange}
              placeholder="Promise Section Title (e.g. Our Promise)"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
            <textarea
              name="promiseDescription"
              rows={3}
              value={formData.promiseDescription}
              onChange={handleChange}
              placeholder="Promise Details Text..."
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutAdmin;