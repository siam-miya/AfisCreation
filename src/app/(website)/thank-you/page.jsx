'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Download, Home, ShoppingBag, Package, MapPin, Phone, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    shippingCost: 0,
    paymentMethod: '',
    cart: [],
    total: 0,
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    // URL থেকে কুয়েরি ডেটা রিড করা
    const orderId = searchParams.get('orderId') || 'AC-' + Math.floor(100000 + Math.random() * 900000);
    const name = searchParams.get('name') || 'Valued Customer';
    const phone = searchParams.get('phone') || 'N/A';
    const email = searchParams.get('email') || 'support@afiscreation.com';
    const address = searchParams.get('address') || 'Dhaka';
    const city = searchParams.get('city') || 'Dhaka';
    const shippingCost = Number(searchParams.get('shippingCost')) || 0;
    const paymentMethod = searchParams.get('paymentMethod') || 'Cash on Delivery';
    
    let cart = [];
    try {
      const cartParam = searchParams.get('cart');
      if (cartParam) {
        cart = JSON.parse(decodeURIComponent(cartParam));
      }
    } catch (e) {
      console.error('Cart parse error:', e);
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const total = subtotal + shippingCost;

    setOrderDetails({
      orderId,
      name,
      phone,
      email,
      address,
      city,
      shippingCost,
      paymentMethod,
      cart,
      total,
    });
  }, [searchParams]);

  // ইনভয়েস পিডিএফ ডাউনলোড করার ফাংশন
  const downloadInvoicePdf = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${orderDetails.orderId}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const subtotalAmount = orderDetails.cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* সফল বার্তা সেকশন */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for shopping with <span className="font-semibold text-amber-700">Afis Creation</span>. We have received your order.
          </p>

          <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-6">
            <span className="text-sm text-gray-500">Order ID: </span>
            <span className="font-mono font-bold text-gray-800">{orderDetails.orderId}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={downloadInvoicePdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download Invoice'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-xl border border-gray-300 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* অর্ডার ডিটেইলস কার্ড */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-700" /> Order Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Customer Information:</p>
              <p className="text-gray-800 font-semibold mt-1">{orderDetails.name}</p>
              <p className="text-gray-600 flex items-center gap-1 mt-0.5"><Phone className="w-3.5 h-3.5" /> {orderDetails.phone}</p>
              <p className="text-gray-600 flex items-center gap-1 mt-0.5"><Mail className="w-3.5 h-3.5" /> {orderDetails.email}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Shipping Address:</p>
              <p className="text-gray-800 flex items-start gap-1 mt-1">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{orderDetails.address}, {orderDetails.city}</span>
              </p>
              <p className="text-gray-500 font-medium mt-3">Payment Method:</p>
              <p className="text-gray-800 font-semibold">{orderDetails.paymentMethod}</p>
            </div>
          </div>

          {/* প্রোডাক্ট লিস্ট */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Ordered Items:</h4>
            <div className="space-y-3">
              {orderDetails.cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold">
                      {item.quantity || 1}x
                    </span>
                    <span className="text-gray-800 font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-semibold">Tk {item.price * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Tk {subtotalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Cost</span>
                <span>Tk {orderDetails.shippingCost}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-amber-700">Tk {orderDetails.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- অফস্ক্রিন ইনভয়েস টেমপ্লেট (PDF ডাউনলোডের জন্য) ----------------- */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div ref={invoiceRef} style={{ width: '800px', padding: '40px', background: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#333' }}>
            
            {/* ইনভয়েস হেডার */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #b45309', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#b45309', margin: 0 }}>Afis Creation</h1>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Your Trusted E-Commerce Store</p>
                <p style={{ fontSize: '11px', color: '#555', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Dhaka, Bangladesh<br />
                  Phone: +8801700000000 | Email: support@afiscreation.com
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', margin: 0 }}>INVOICE</h2>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Order ID: <b>{orderDetails.orderId}</b></p>
                <p style={{ fontSize: '12px', color: '#666', margin: '3px 0 0 0' }}>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* কাস্টমার ও বিলিং ইনফো */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', background: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#b45309', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Billed To:</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#111' }}>{orderDetails.name}</p>
                <p style={{ fontSize: '12px', color: '#555', margin: '3px 0 0 0' }}>Phone: {orderDetails.phone}</p>
                <p style={{ fontSize: '12px', color: '#555', margin: '3px 0 0 0' }}>Email: {orderDetails.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#b45309', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Shipping Address:</p>
                <p style={{ fontSize: '13px', color: '#444', margin: 0, maxWidth: '250px' }}>{orderDetails.address}, {orderDetails.city}</p>
                <p style={{ fontSize: '12px', color: '#555', margin: '5px 0 0 0' }}>Payment: <b>{orderDetails.paymentMethod}</b></p>
              </div>
            </div>

            {/* টেবিল */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
              <thead>
                <tr style={{ background: '#b45309', color: '#ffffff' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px' }}>Item Description</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px' }}>Quantity</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>Price</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.cart.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#333' }}>{item.name}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', color: '#555' }}>{item.quantity || 1}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: '#555' }}>Tk {item.price}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: '#111' }}>
                      Tk {item.price * (item.quantity || 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* টোটাল ক্যালকুলেশন */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#555' }}>
                  <span>Subtotal:</span>
                  <span>Tk {subtotalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#555', borderBottom: '1px solid #e5e7eb' }}>
                  <span>Shipping Fee:</span>
                  <span>Tk {orderDetails.shippingCost}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '15px', fontWeight: 'bold', color: '#b45309' }}>
                  <span>Total Amount:</span>
                  <span>Tk {orderDetails.total}</span>
                </div>
              </div>
            </div>

            {/* ফুটার নোট */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', color: '#777', fontSize: '11px' }}>
              <p style={{ margin: 0 }}>Thank you for your business! If you have any questions, contact us at support@afiscreation.com</p>
              <p style={{ margin: '5px 0 0 0' }}>Afis Creation — All rights reserved.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}