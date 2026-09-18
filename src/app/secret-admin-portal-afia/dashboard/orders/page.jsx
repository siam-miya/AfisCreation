"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Spinner } from "@heroui/react";

import {
  ShieldCheck,
  Truck,
  Loader2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  PackageCheck,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { toast } from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState({});

  const [copiedId, setCopiedId] = useState("");

  // ========================================
  // ADDRESS EDIT STATE
  // ========================================

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [editingAddress, setEditingAddress] =
    useState("");

  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  ).replace(/\/+$/, "");

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/orders`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // ACTION LOADING
  // =========================

  const setAction = (
    orderId,
    action,
    value
  ) => {
    setActionLoading((prev) => ({
      ...prev,
      [`${orderId}-${action}`]: value,
    }));
  };

  const isActionLoading = (
    orderId,
    action
  ) => {
    return !!actionLoading[
      `${orderId}-${action}`
    ];
  };

  // ========================================
  // START ADDRESS EDIT
  // ========================================

  const handleStartAddressEdit = (
    order
  ) => {
    setEditingAddressId(order._id);
    setEditingAddress(
      order.streetAddress || ""
    );
  };

  // ========================================
  // CANCEL ADDRESS EDIT
  // ========================================

  const handleCancelAddressEdit = () => {
    setEditingAddressId(null);
    setEditingAddress("");
  };

  // ========================================
  // SAVE UPDATED ADDRESS
  // ========================================

  const handleSaveAddress = async (
    order
  ) => {
    const cleanAddress =
      editingAddress.trim();

    if (!cleanAddress) {
      toast.error(
        "Customer address cannot be empty."
      );
      return;
    }

    setAction(
      order._id,
      "address",
      true
    );

    try {
      const res = await fetch(
        `${apiUrl}/api/orders/${order._id}/address`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            streetAddress:
              cleanAddress,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update address."
        );
      }

      // Update order locally
      setOrders(
        (prevOrders) =>
          prevOrders.map(
            (item) =>
              item._id === order._id
                ? {
                    ...item,
                    streetAddress:
                      data.order
                        ?.streetAddress ||
                      cleanAddress,
                    updatedAt:
                      data.order
                        ?.updatedAt ||
                      item.updatedAt,
                  }
                : item
          )
      );

      setEditingAddressId(null);
      setEditingAddress("");

      toast.success(
        "Customer address updated successfully."
      );
    } catch (error) {
      console.error(
        "Address update error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update address."
      );
    } finally {
      setAction(
        order._id,
        "address",
        false
      );
    }
  };

  // =========================
  // FRAUD CHECK
  // =========================

  const handleFraudCheck = async (
    order
  ) => {
    setAction(
      order._id,
      "fraud",
      true
    );

    try {
      const res = await fetch(
        `${apiUrl}/api/fraud/check/${order._id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (
        !res.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Fraud check failed"
        );
      }

      toast.success(
        "Fraud check completed"
      );

      const fraudResult =
        data.fraudCheck ||
        data.result;

      setOrders(
        (prevOrders) =>
          prevOrders.map(
            (item) =>
              item._id === order._id
                ? {
                    ...item,
                    fraudCheck:
                      fraudResult,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "Fraud check error:",
        error
      );

      toast.error(
        error.message ||
          "Fraud check failed"
      );
    } finally {
      setAction(
        order._id,
        "fraud",
        false
      );
    }
  };

  // =========================
  // PATHAO ENTRY
  // =========================

  const handlePathaoEntry = async (
    order
  ) => {
    const existingCourier =
      order.courier?.provider ||
      order.courierName ||
      null;

    const existingConsignment =
      order.courier?.consignmentId ||
      order.consignment_id ||
      null;

    if (
      existingCourier ||
      existingConsignment
    ) {
      toast.error(
        "This order has already been submitted to a courier"
      );

      return;
    }

    // Address check before courier entry
    const currentAddress =
      String(
        order.streetAddress || ""
      ).trim();

    if (!currentAddress) {
      toast.error(
        "Please add the customer's address before sending to Pathao."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to send ${order.orderId} to Pathao?`
      );

    if (!confirmed) return;

    setAction(
      order._id,
      "pathao",
      true
    );

    try {
      const res = await fetch(
        `${apiUrl}/api/courier/push-to-pathao/${order._id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type":
              "application/json",
          },
        }
      );

      const data = await res.json();

      if (
        !res.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to send order to Pathao"
        );
      }

      toast.success(
        "Order successfully sent to Pathao"
      );

      setOrders(
        (prevOrders) =>
          prevOrders.map(
            (item) =>
              item._id === order._id
                ? data.order
                : item
          )
      );
    } catch (error) {
      console.error(
        "Pathao entry error:",
        error
      );

      toast.error(
        error.message ||
          "Pathao entry failed"
      );
    } finally {
      setAction(
        order._id,
        "pathao",
        false
      );
    }
  };

  // =========================
  // STEADFAST ENTRY
  // =========================

  const handleSteadFastEntry = async (
    order
  ) => {
    const existingCourier =
      order.courier?.provider ||
      order.courierName ||
      null;

    const existingConsignment =
      order.courier?.consignmentId ||
      order.consignment_id ||
      null;

    if (
      existingCourier ||
      existingConsignment
    ) {
      toast.error(
        "This order has already been submitted to a courier"
      );

      return;
    }

    toast.error(
      "SteadFast integration is not connected yet."
    );
  };

  // =========================
  // COPY TRACKING ID
  // =========================

  const copyTracking = async (
    value
  ) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopiedId(value);

      setTimeout(() => {
        setCopiedId("");
      }, 1500);

      toast.success("Copied");
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (
    status
  ) => {
    const normalized = String(
      status || ""
    )
      .toLowerCase()
      .trim();

    if (
      normalized.includes(
        "delivered"
      )
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      normalized.includes(
        "shipped"
      ) ||
      normalized.includes(
        "transit"
      ) ||
      normalized.includes(
        "out for delivery"
      )
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      normalized.includes(
        "cancel"
      ) ||
      normalized.includes(
        "failed"
      ) ||
      normalized.includes(
        "return"
      )
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalized.includes(
        "processing"
      )
    ) {
      return "bg-purple-100 text-purple-700";
    }

    if (
      normalized.includes(
        "ready"
      )
    ) {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-yellow-100 text-yellow-800";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner color="danger" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Customer Orders
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage orders, fraud checks and courier shipments.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <PackageCheck
            className="mx-auto text-gray-300 mb-3"
            size={40}
          />

          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse min-w-[1500px]">
            <thead>
              <tr className="bg-gray-100 border-b text-sm text-gray-700">
                <th className="p-3">
                  Order ID
                </th>

                <th className="p-3">
                  Customer Info
                </th>

                <th className="p-3">
                  Products
                </th>

                <th className="p-3">
                  Shipping
                </th>

                <th className="p-3">
                  Total
                </th>

                <th className="p-3">
                  Order Status
                </th>

                <th className="p-3">
                  Fraud Check
                </th>

                <th className="p-3">
                  Courier
                </th>

                <th className="p-3">
                  Tracking
                </th>

                <th className="p-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-sm">
              {orders.map((order) => {
                const courierProvider =
                  order.courier?.provider ||
                  order.courierName ||
                  null;

                const consignmentId =
                  order.courier
                    ?.consignmentId ||
                  order.consignment_id ||
                  null;

                const trackingCode =
                  order.courier
                    ?.trackingCode ||
                  order.tracking_code ||
                  null;

                const courierStatus =
                  order.courier?.status ||
                  order.delivery_status ||
                  null;

                const courierSubmitted =
                  !!courierProvider ||
                  !!consignmentId;

                const fraud =
                  order.fraudCheck;

                const isEditingAddress =
                  editingAddressId ===
                  order._id;

                return (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 align-top"
                  >
                    {/* ORDER ID */}

                    <td className="p-3">
                      <p className="font-mono font-semibold text-amber-700">
                        {order.orderId}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : ""}
                      </p>
                    </td>

                    {/* CUSTOMER */}

                    <td className="p-3 min-w-[280px]">
                      <p className="font-semibold">
                        {order.fullName}
                      </p>

                      <p className="text-gray-500">
                        {order.phoneNumber}
                      </p>

                      {/* ADDRESS */}

                      {isEditingAddress ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={
                              editingAddress
                            }
                            onChange={(e) =>
                              setEditingAddress(
                                e.target.value
                              )
                            }
                            rows={3}
                            autoFocus
                            className="w-full min-w-[250px] border border-orange-300 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                            placeholder="Enter complete customer address..."
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveAddress(
                                  order
                                )
                              }
                              disabled={isActionLoading(
                                order._id,
                                "address"
                              )}
                              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-[11px] font-semibold"
                            >
                              {isActionLoading(
                                order._id,
                                "address"
                              ) ? (
                                <Loader2
                                  size={12}
                                  className="animate-spin"
                                />
                              ) : (
                                <Save
                                  size={12}
                                />
                              )}

                              Save
                            </button>

                            <button
                              type="button"
                              onClick={
                                handleCancelAddressEdit
                              }
                              disabled={isActionLoading(
                                order._id,
                                "address"
                              )}
                              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 text-[11px] font-semibold"
                            >
                              <X size={12} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <p className="text-xs text-gray-400 max-w-xs">
                            {order.streetAddress ||
                              "No address"}
                          </p>

                          {/* EDIT ADDRESS */}

                          {!courierSubmitted && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStartAddressEdit(
                                  order
                                )
                              }
                              className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              <Pencil
                                size={11}
                              />
                              Edit Address
                            </button>
                          )}
                        </div>
                      )}

                      {order.orderNotes && (
                        <p className="text-xs italic text-blue-600 mt-1">
                          Note:{" "}
                          {order.orderNotes}
                        </p>
                      )}
                    </td>

                    {/* PRODUCTS */}

                    <td className="p-3 min-w-[280px]">
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {order.cart?.map(
                          (item, idx) => (
                            <div
                              key={
                                item.cartItemId ||
                                idx
                              }
                              className="flex items-start gap-2 border-b pb-2 last:border-none last:pb-0"
                            >
                              <div className="w-10 h-10 relative bg-gray-50 border rounded shrink-0 mt-0.5 overflow-hidden">
                                <Image
                                  src={
                                    item.thumbnail ||
                                    "/placeholder.png"
                                  }
                                  alt={
                                    item.title ||
                                    "Product"
                                  }
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <p className="font-medium text-xs">
                                  {item.title}{" "}
                                  (x
                                  {item.quantity ||
                                    1}
                                  )
                                </p>

                                <p className="text-[10px] text-gray-500">
                                  ৳
                                  {item.price}{" "}
                                  each
                                </p>

                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.selectedColor && (
                                    <span className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 font-medium">
                                      Color:{" "}
                                      {
                                        item.selectedColor
                                      }
                                    </span>
                                  )}

                                  {item.selectedSize && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                      Size:{" "}
                                      {
                                        item.selectedSize
                                      }
                                    </span>
                                  )}
                                </div>

                                {item.productNote && (
                                  <p className="text-[10px] italic text-indigo-600 mt-0.5">
                                    Note:{" "}
                                    {
                                      item.productNote
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>

                    {/* SHIPPING */}

                    <td className="p-3 text-xs">
                      <span className="capitalize">
                        {
                          order.shippingMethod
                        }
                      </span>

                      <p className="text-gray-500 mt-1">
                        ৳
                        {Number(
                          order.shippingCharge ||
                            0
                        )}
                      </p>
                    </td>

                    {/* TOTAL */}

                    <td className="p-3 font-bold text-gray-900">
                      ৳
                      {Number(
                        order.totalCost || 0
                      )}
                    </td>

                    {/* ORDER STATUS */}

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status ||
                          "Pending"}
                      </span>

                      {courierStatus && (
                        <p className="text-[10px] text-gray-500 mt-2">
                          Courier:{" "}
                          {
                            courierStatus
                          }
                        </p>
                      )}
                    </td>

                    {/* FRAUD */}

                    <td className="p-3 min-w-[150px]">
                      {fraud?.checked ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            {fraud.riskLevel ===
                            "High" ? (
                              <AlertTriangle
                                size={15}
                                className="text-red-500"
                              />
                            ) : (
                              <CheckCircle2
                                size={15}
                                className="text-emerald-500"
                              />
                            )}

                            <span
                              className={`text-xs font-bold ${
                                fraud.riskLevel ===
                                "High"
                                  ? "text-red-600"
                                  : fraud.riskLevel ===
                                    "Medium"
                                  ? "text-orange-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {
                                fraud.riskLevel
                              }
                            </span>
                          </div>

                          <p className="text-[10px] text-gray-400 mt-1">
                            {fraud.totalOrders ||
                              0}{" "}
                            previous
                            orders
                          </p>

                          {fraud.checkedAt && (
                            <p className="text-[9px] text-gray-400 mt-1">
                              {new Date(
                                fraud.checkedAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not checked
                        </span>
                      )}
                    </td>

                    {/* COURIER */}

                    <td className="p-3 min-w-[160px]">
                      {courierProvider ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Truck
                              size={15}
                              className="text-blue-600"
                            />

                            <span className="font-semibold text-xs">
                              {
                                courierProvider
                              }
                            </span>
                          </div>

                          <p className="text-[10px] text-gray-500 mt-1">
                            {courierStatus ||
                              "Pending"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* TRACKING */}

                    <td className="p-3 min-w-[190px]">
                      {consignmentId ||
                      trackingCode ? (
                        <div className="space-y-1.5">
                          {consignmentId && (
                            <div>
                              <p className="text-[9px] uppercase font-bold text-gray-400">
                                Consignment
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  copyTracking(
                                    consignmentId
                                  )
                                }
                                className="flex items-center gap-1 text-xs font-mono text-blue-600 hover:underline"
                              >
                                {
                                  consignmentId
                                }

                                {copiedId ===
                                consignmentId ? (
                                  <CheckCircle2
                                    size={12}
                                  />
                                ) : (
                                  <Copy
                                    size={12}
                                  />
                                )}
                              </button>
                            </div>
                          )}

                          {trackingCode && (
                            <div>
                              <p className="text-[9px] uppercase font-bold text-gray-400">
                                Tracking
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  copyTracking(
                                    trackingCode
                                  )
                                }
                                className="flex items-center gap-1 text-xs font-mono text-blue-600 hover:underline"
                              >
                                {
                                  trackingCode
                                }

                                {copiedId ===
                                trackingCode ? (
                                  <CheckCircle2
                                    size={12}
                                  />
                                ) : (
                                  <Copy
                                    size={12}
                                  />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No tracking ID
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-3 min-w-[230px]">
                      <div className="flex flex-col gap-2">
                        {/* FRAUD */}

                        <button
                          type="button"
                          onClick={() =>
                            handleFraudCheck(
                              order
                            )
                          }
                          disabled={isActionLoading(
                            order._id,
                            "fraud"
                          )}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 disabled:opacity-50 text-xs font-bold transition"
                        >
                          {isActionLoading(
                            order._id,
                            "fraud"
                          ) ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <ShieldCheck
                              size={14}
                            />
                          )}

                          {fraud?.checked
                            ? "Check Again"
                            : "Fraud Check"}
                        </button>

                        {/* PATHAO */}

                        <button
                          type="button"
                          onClick={() =>
                            handlePathaoEntry(
                              order
                            )
                          }
                          disabled={
                            courierSubmitted ||
                            isActionLoading(
                              order._id,
                              "pathao"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition"
                        >
                          {isActionLoading(
                            order._id,
                            "pathao"
                          ) ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Truck
                              size={14}
                            />
                          )}

                          {courierProvider ===
                          "Pathao"
                            ? "Pathao Submitted"
                            : courierSubmitted
                            ? "Courier Submitted"
                            : "Send to Pathao"}
                        </button>

                        {/* STEADFAST */}

                        <button
                          type="button"
                          onClick={() =>
                            handleSteadFastEntry(
                              order
                            )
                          }
                          disabled={
                            courierSubmitted
                          }
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition"
                        >
                          <Truck size={14} />

                          {courierProvider ===
                          "SteadFast"
                            ? "SteadFast Submitted"
                            : "Send to SteadFast"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

