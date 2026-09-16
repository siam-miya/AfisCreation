'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Download, Home, Package, MapPin, Phone } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    name: '',
    phone: '',
    email: 'support@afiscreation.com',
    address: '',
    city: 'Dhaka',
    shippingCost: 0,
    paymentMethod: 'Cash on Delivery',
    cart: [],
    total: 0,
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');

    if (orderId) {
      // লোকালস্টোরেজ থেকে অর্ডারের সিকিউরড ডেটা লোড করা হচ্ছে
      const savedOrder = localStorage.getItem(`order_${orderId}`);
      if (savedOrder) {
        try {
          const parsedData = JSON.parse(savedOrder);
          setOrderDetails((prev) => ({
            ...prev,
            ...parsedData,
          }));
          return;
        } catch (e) {
          console.error('Failed to parse order from localStorage', e);
        }
      }

      // যদি লোকালস্টোরেজে না থাকে, তবে ব্যাকএন্ড থেকে ফেচ করার ফলব্যাক রাখা হলো (প্রোডাকশন স্ট্যান্ডার্ড)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setOrderDetails({
              orderId: data.orderId || orderId,
              name: data.fullName || 'Valued Customer',
              phone: data.phoneNumber || 'N/A',
              email: 'support@afiscreation.com',
              address: data.streetAddress || 'Dhaka',
              city: 'Dhaka',
              shippingCost: data.shippingCharge || 0,
              paymentMethod: 'Cash on Delivery',
              cart: data.cart || [],
              total: data.totalCost || 0,
            });
          }
        })
        .catch((err) => console.error('Error fetching order from backend:', err));
    }
  }, [searchParams]);

  // প্রফেশনাল পিডিএফ ইনভয়েস ডাউনলোড ফাংশন
  const downloadInvoicePdf = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, logging: false });
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

  const subtotalAmount = orderDetails.cart.reduce((acc, item) => acc + (Number(item.price) * (Number(item.quantity) || 1)), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Header */}
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
            <span className="font-mono font-bold text-gray-800">{orderDetails.orderId || 'Processing...'}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={downloadInvoicePdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
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

        {/* Order Summary with Image, Color, Size & Customization */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-700" /> Order Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Customer Information:</p>
              <p className="text-gray-800 font-semibold mt-1">{orderDetails.name}</p>
              <p className="text-gray-600 flex items-center gap-1 mt-0.5"><Phone className="w-3.5 h-3.5" /> {orderDetails.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Shipping Address:</p>
              <p className="text-gray-800 flex items-start gap-1 mt-1">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{orderDetails.address}</span>
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Ordered Items:</h4>
            <div className="space-y-4">
              {orderDetails.cart.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm py-3 border-b border-gray-100 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden relative shrink-0">
                      <Image
                        src={item.thumbnail || '/placeholder.png'}
                        alt={item.title || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity || 1} | Price: ৳{item.price} each</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.selectedColor && (
                          <span className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 font-medium">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>

                      {item.customization && (item.customization.length || item.customization.width || item.customization.sleeve || item.customization.instructions) && (
                        <div className="mt-1.5 text-xs bg-amber-50 text-amber-900 p-2 rounded border border-amber-200 space-y-0.5">
                          <p className="font-bold">Customization:</p>
                          {item.customization.length && <p>Length: {item.customization.length}"</p>}
                          {item.customization.width && <p>Width: {item.customization.width}"</p>}
                          {item.customization.sleeve && <p>Sleeve: {item.customization.sleeve}"</p>}
                          {item.customization.instructions && <p className="italic">Note: {item.customization.instructions}</p>}
                        </div>
                      )}

                      {item.productNote && (
                        <p className="text-xs italic text-indigo-600 mt-1">Note: {item.productNote}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-900 font-semibold self-end sm:self-center">৳{(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{subtotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Cost</span>
                <span>৳{orderDetails.shippingCost}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-amber-700">৳{orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- HIDDEN PROFESSIONAL INVOICE FOR PDF ----------------- */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <div ref={invoiceRef} style={{ width: '800px', padding: '40px', background: '#ffffff', color: '#333333', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #b45309', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '26px', color: '#b45309', margin: '0 0 5px 0', fontWeight: 'bold' }}>Afis Creation</h1>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Elegance in Every Stitch</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Email: support@afiscreation.com</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '22px', margin: '0 0 5px 0', color: '#333' }}>INVOICE</h2>
                <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#b45309' }}>Order ID: {orderDetails.orderId}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '14px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#b45309' }}>Billed To:</h4>
                <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>{orderDetails.name}</p>
                <p style={{ margin: '0 0 3px 0' }}>Phone: {orderDetails.phone}</p>
                <p style={{ margin: '0' }}>Address: {orderDetails.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#b45309' }}>Payment Method:</h4>
                <p style={{ margin: '0' }}>Cash on Delivery (COD)</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.cart.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                        {item.selectedColor && `Color: ${item.selectedColor} | `}
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                      </div>
                      {item.customization && (
                        <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>
                          {item.customization.length && `Length: ${item.customization.length}" `}
                          {item.customization.width && `Width: ${item.customization.width}" `}
                          {item.customization.sleeve && `Sleeve: ${item.customization.sleeve}"`}
                          {item.customization.instructions && <div style={{ fontStyle: 'italic' }}>Note: {item.customization.instructions}</div>}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>{item.quantity || 1}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>৳{item.price}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold' }}>৳{(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '250px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Subtotal:</span>
                  <span>৳{subtotalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Shipping:</span>
                  <span>৳{orderDetails.shippingCost}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 'bold', fontSize: '16px', color: '#b45309' }}>
                  <span>Total:</span>
                  <span>৳{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '11px', color: '#888', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <p style={{ margin: '0' }}>Thank you for your purchase with Afis Creation! For any query, contact us at support@afiscreation.com</p>
            </div>
          </div>
        </div>
        {/* ----------------- END HIDDEN INVOICE ----------------- */}

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