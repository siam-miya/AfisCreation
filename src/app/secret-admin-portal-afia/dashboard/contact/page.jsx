'use client';
import React, { useState, useEffect } from 'react';
import { Trash2, Save, Mail, Phone, Clock, Loader2 } from 'lucide-react';

const ContactAdmin = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [infoForm, setInfoForm] = useState({
    phone: '',
    availability: '',
    email1: '',
    email2: '',
    writeUsSubtext: ''
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadInitialData = async () => {
      setIsFetching(true);
      await Promise.all([fetchInfo(), fetchMessages()]);
      setIsFetching(false);
    };
    loadInitialData();
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/contact/info`);
      if (!res.ok) throw new Error('Failed to fetch contact info');
      
      const data = await res.json();
      if (data.success && data.data) {
        setInfoForm({
          phone: data.data.phone || '',
          availability: data.data.availability || '',
          email1: data.data.email1 || '',
          email2: data.data.email2 || '',
          writeUsSubtext: data.data.writeUsSubtext || ''
        });
      }
    } catch (err) {
      console.error('Fetch Info Error:', err.message);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/contact/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');

      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error('Fetch Messages Error:', err.message);
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ব্যাকএন্ডে শুধু প্রয়োজনীয় ডাটা পাঠানো (MongoDB IDs/timestamps বাদ দিয়ে)
      const payload = {
        phone: infoForm.phone,
        availability: infoForm.availability,
        email1: infoForm.email1,
        email2: infoForm.email2,
        writeUsSubtext: infoForm.writeUsSubtext
      };

      const res = await fetch(`${BASE_URL}/api/contact/info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Contact Info updated successfully!');
      } else {
        alert(data.message || 'Failed to update info');
      }
    } catch (err) {
      alert('Failed to update info. Check console/server logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/contact/messages/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        alert(data.message || 'Failed to delete message');
      }
    } catch (err) {
      alert('Failed to delete message');
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Contact Management</h1>
        <div className="flex gap-2 bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'messages' ? 'bg-white text-orange-500 shadow' : 'text-slate-600'
            }`}
          >
            Customer Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'info' ? 'bg-white text-orange-500 shadow' : 'text-slate-600'
            }`}
          >
            Update Contact Info
          </button>
        </div>
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : activeTab === 'messages' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase text-xs">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Message</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-400">
                      No messages received yet.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap text-xs text-slate-400">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{msg.name}</td>
                      <td className="p-4">
                        <div>{msg.email}</div>
                        <div className="text-xs text-slate-400">{msg.phone}</div>
                      </td>
                      <td className="p-4 max-w-md break-words">{msg.message}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-3xl">
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={infoForm.phone}
                onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Availability Subtext</label>
              <input
                type="text"
                value={infoForm.availability}
                onChange={(e) => setInfoForm({ ...infoForm, availability: e.target.value })}
                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address 1</label>
              <input
                type="email"
                value={infoForm.email1}
                onChange={(e) => setInfoForm({ ...infoForm, email1: e.target.value })}
                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address 2</label>
              <input
                type="email"
                value={infoForm.email2}
                onChange={(e) => setInfoForm({ ...infoForm, email2: e.target.value })}
                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Write To Us Subtext</label>
              <textarea
                rows="2"
                value={infoForm.writeUsSubtext}
                onChange={(e) => setInfoForm({ ...infoForm, writeUsSubtext: e.target.value })}
                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-orange-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactAdmin;


