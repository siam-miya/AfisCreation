"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiSearch, FiPackage, FiArrowLeft, FiAlertTriangle, FiCheck, FiMapPin } from "react-icons/fi";
import { Truck, Calendar, Clock, ChevronRight } from "lucide-react";
import { CiDeliveryTruck } from "react-icons/ci";

const MOCK_ORDERS = {
    "CB-12345": {
        id: "CB-12345",
        status: "In Transit",
        date: "July 18, 2026",
        eta: "July 22, 2026",
        carrier: "Pathao Courier",
        steps: [
            { title: "Order Placed", desc: "We have received your order", time: "10:30 AM", completed: true },
            { title: "Order Confirmed", desc: "Seller has accepted the order", time: "02:15 PM", completed: true },
            { title: "In Transit", desc: "On the way to your city hub", time: "09:00 AM", completed: true, current: true },
            { title: "Out for Delivery", desc: "Courier partner will deliver today", time: "Pending", completed: false },
        ]
    },
    "CB-67890": {
        id: "CB-67890",
        status: "Delivered",
        date: "July 15, 2026",
        eta: "Delivered",
        carrier: "RedX",
        steps: [
            { title: "Order Placed", desc: "We have received your order", time: "11:00 AM", completed: true },
            { title: "Order Confirmed", desc: "Seller has accepted the order", time: "01:00 PM", completed: true },
            { title: "In Transit", desc: "Package reached local hub", time: "05:00 PM", completed: true },
            { title: "Delivered", desc: "Successfully handed over to customer", time: "04:30 PM", completed: true, current: true },
        ]
    }
};

const OrderTrack = () => {
    const [orderNumber, setOrderNumber] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [isSearched, setIsSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const cleanId = orderNumber.trim();
        if (!cleanId) return;

        setIsSearched(true);
        if (MOCK_ORDERS[cleanId]) {
            setOrderData(MOCK_ORDERS[cleanId]);
        } else {
            setOrderData(null);
        }
    };

    return (
        <section className="min-h-screen bg-[#f3f4f6] font-poppins py-12 md:py-20 px-4 relative overflow-hidden">
            <div className="container">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#eb6e1b]/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl -z-10"></div>
                <div>

                    <div className="mb-10 flex items-center justify-between">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#eb6e1b] transition-all bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 group"
                        >
                            <FiArrowLeft className="transform group-hover:-translate-x-1 transition-transform text-sm" />
                            <span>Back to Shop</span>
                        </Link>
                        <span className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-sm tracking-wide select-none">
                            <CiDeliveryTruck size={18} className="text-[#eb6e1b] animate-bounce" /> Live Tracking
                        </span>
                    </div>

                    <div className="space-y-6">

                        <div className="bg-white rounded-br-4xl rounded-tl-4xl p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-100">
                            <div className="max-w-xl mx-auto text-center mb-8">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                    Track Your  <span className="text-[#eb6e1b] relative inline-block">Order<span className="absolute left-0 bottom-1 w-full h-[4px] bg-[#eb6e1b]/20 rounded"></span></span>
                                </h1>
                                <p className="text-xs text-gray-400 mt-2 font-medium">
                                    Enter your order serial key below. Try testing with <span className="text-slate-700 font-bold underline cursor-pointer" onClick={() => setOrderNumber("CB-12345")}>CB-12345</span> or <span className="text-slate-700 font-bold underline cursor-pointer" onClick={() => setOrderNumber("CB-67890")}>CB-67890</span>.
                                </p>
                            </div>

                            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                                <div className="relative flex flex-col sm:flex-row items-center gap-2.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-200 focus-within:bg-white focus-within:border-[#eb6e1b] focus-within:ring-4 focus-within:ring-[#eb6e1b]/5 transition-all duration-300">
                                    <div className="relative w-full flex items-center">
                                        <FiSearch className="text-slate-400 text-lg absolute left-4" />
                                        <input
                                            type="text"
                                            placeholder="Enter Order Identification ID..."
                                            value={orderNumber}
                                            onChange={(e) => setOrderNumber(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-transparent text-sm text-slate-800 placeholder-gray-400 outline-none font-medium"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto bg-[#eb6e1b] hover:bg-slate-950 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md shadow-orange-600/10 active:scale-[0.98] whitespace-nowrap"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="transition-all duration-500">
                            {orderData ? (
                                <div className="space-y-5 animate-fadeIn">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { label: "Parcel ID", val: orderData.id, icon: <FiPackage className="text-[#eb6e1b]" /> },
                                            { label: "Logistics Partner", val: orderData.carrier, icon: <Truck size={14} className="text-[#eb6e1b]" /> },
                                            { label: "Estimated Target", val: orderData.eta, icon: <Calendar size={14} className="text-[#eb6e1b]" />, highlight: true },
                                            { label: "Current Status", val: orderData.status, icon: <FiMapPin className="text-[#eb6e1b]" />, isBadge: true }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-bl-2xl rounded-tr-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                                <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100">{item.icon}</div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                                                    {item.isBadge ? (
                                                        <span className="mt-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-extrabold self-start uppercase">
                                                            {item.val}
                                                        </span>
                                                    ) : (
                                                        <span className={`text-xs font-bold tracking-tight truncate ${item.highlight ? "text-[#eb6e1b]" : "text-slate-800"}`}>
                                                            {item.val}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white rounded-tr-4xl rounded-bl-4xl p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-100">
                                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span>Journey Timeline</span>
                                            <span className="h-[1px] bg-gray-100 flex-1"></span>
                                        </h3>

                                        <div className="relative pl-8 space-y-6 before:absolute before:bottom-6 before:top-2 before:left-[13px] before:w-[2px] before:bg-slate-100">
                                            {orderData.steps.map((step, index) => (
                                                <div key={index} className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${step.current
                                                        ? "bg-gradient-to-r from-orange-50/50 to-transparent border-orange-200/60 shadow-sm"
                                                        : "bg-transparent border-transparent"
                                                    }`}>

                                                    <div className={`absolute -left-[27px] w-3 h-3 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${step.completed
                                                            ? "bg-[#eb6e1b] ring-4 ring-orange-100"
                                                            : "bg-gray-200 ring-4 ring-gray-50"
                                                        }`}>
                                                        {step.completed && <FiCheck className="text-[7px] text-white stroke-[4]" />}
                                                    </div>

                                                    <div className="space-y-0.5 min-w-0 flex-1 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`text-xs font-extrabold tracking-tight ${step.current ? "text-[#eb6e1b]" : "text-slate-800"}`}>
                                                                {step.title}
                                                            </h4>
                                                            {step.current && (
                                                                <span className="text-[9px] font-black uppercase bg-[#eb6e1b] text-white px-1.5 py-0.5 rounded tracking-wider animate-pulse">
                                                                    Live
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 font-medium truncate">{step.desc}</p>
                                                    </div>
                                                    <div className="mt-2 sm:mt-0 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-gray-100 self-start sm:self-auto">
                                                        <Clock size={11} className="text-slate-400" />
                                                        <span>{step.time}</span>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            ) : isSearched ? (
                                <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto border border-red-100 shadow-sm animate-fadeIn">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
                                        <FiAlertTriangle size={20} />
                                    </div>
                                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Shipment Not Traced</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed mt-1.5 px-4">
                                        The shipment index reference <span className="font-bold text-slate-700">{orderNumber}</span> was not found in our hub directory database.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-10 text-center max-w-sm mx-auto border border-dashed border-gray-200 select-none">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4 border border-gray-100">
                                        <FiPackage size={18} />
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 leading-relaxed px-2">
                                        Awaiting input telemetry data. Fill the tracker form above to visualize real-time package logistics.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="mt-12 text-center text-[11px] font-bold tracking-wide text-gray-400 uppercase flex items-center justify-center gap-1.5">
                        <span>Stuck somewhere?</span>
                        <Link href={"/contact"} className="text-[#eb6e1b] hover:underline flex items-center gap-0.5">
                            Open Support Ticket <ChevronRight size={12} />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OrderTrack;