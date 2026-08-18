'use client';

import React, { useState } from 'react';
import { FiPhone } from 'react-icons/fi';
import { TfiEmail } from 'react-icons/tfi';
import { toast } from 'react-toastify';
import Button from './Button';

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Please fill in all required (*) fields.');
      return;
    }

    toast.success('Message sent successfully!');
    console.log('Contact Form Submitted:', formData);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section className="container mx-auto px-4 py-10 font-sans text-black">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-stretch">
        <div className="bg-white p-8 rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#eb6e1b] rounded-full flex items-center justify-center text-white text-xl">
                <FiPhone />
              </div>
              <h3 className="font-medium text-base">Call To Us</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-800">
              <p>We are available 24/7, 7 days a week.</p>
              <p className="font-medium">Phone: +8801611112222</p>
            </div>
          </div>

          <hr className="border-gray-300" />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#eb6e1b] rounded-full flex items-center justify-center text-white text-xl">
                <TfiEmail />
              </div>
              <h3 className="font-medium text-base">Write To Us</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-800">
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p>Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="bg-white p-8 rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-[#F5F5F5] rounded p-3 text-sm focus:outline-none border border-transparent focus:border-[#eb6e1b] transition-all"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#F5F5F5] rounded p-3 text-sm focus:outline-none border border-transparent focus:border-[#eb6e1b] transition-all"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone *"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-[#F5F5F5] rounded p-3 text-sm focus:outline-none border border-transparent focus:border-[#eb6e1b] transition-all"
              required
            />
          </div>
          <div className="flex-1">
            <textarea
              name="message"
              placeholder="Your Message *"
              rows="6"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full bg-[#F5F5F5] rounded p-3 text-sm focus:outline-none border border-transparent focus:border-[#eb6e1b] transition-all resize-none h-full min-h-[150px]"
              required
            ></textarea>
          </div>
          <div className="flex justify-end pt-2">
            <Button TagName={"button"} type='submit'>Send Message</Button>
          </div>
        </form>

      </div>
    </section>
  );
};

export default ContactFormSection;