"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2, Home, Download } from "lucide-react";
import Link from "next/link";

interface OrderDetails {
  id?: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  userId?: string;
  notes?: {
    email?: string;
    contact?: string;
    product?: string;
    payment_link_id?: string;
    payment_link_url?: string;
  };
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    mobile?: string;
    name?: string;
  };
}

function TransactionCompleteContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  const paymentLinkId = searchParams.get("razorpay_payment_link_id");

  const [printDateTime, setPrintDateTime] = useState({ date: "", time: "" });

  const handleDownloadPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  useEffect(() => {
    const now = new Date();
    setPrintDateTime({
      date: now.toLocaleDateString("en-GB"),
      time: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    });
  }, []);

  useEffect(() => {
    if (!paymentLinkId) {
      setLoading(false);
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const v2BaseUrl = process.env.NEXT_PUBLIC_ACEAPP_V2_URL || "http://localhost:8080";
        const response = await fetch(
          `${v2BaseUrl}/payment/order-status?order_id=${paymentLinkId}`
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve order status from the server.");
        }

        const data = await response.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          throw new Error("Order details not found in API response.");
        }
      } catch (err: any) {
        console.error("Error fetching order status:", err);
        setError(err.message || "An error occurred while loading transaction status.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [paymentLinkId]);

  if (!paymentLinkId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-500 mb-4">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h1>
          <p className="text-gray-500 mb-6">
            We couldn't find any transaction query parameters. If you just completed a payment, please verify your email or contact support.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-md transition-all duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying Transaction</h2>
          <p className="text-gray-500">Please wait while we check your payment status...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="inline-flex p-3 rounded-full bg-red-50 text-red-500 mb-4">
            <XCircle className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
          <p className="text-gray-500 mb-6">{error || "Could not verify your transaction status."}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-md transition-all duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Determine status color and UI
  const isPaid = order.status?.toLowerCase() === "paid";
  const isPending = ["pending", "created", "attempted"].includes(order.status?.toLowerCase() || "");
  const isCancelled = ["cancelled", "failed"].includes(order.status?.toLowerCase() || "");

  let statusIcon = <Info className="w-12 h-12" />;
  let statusBg = "bg-blue-50 text-blue-500";
  let statusTitle = "Transaction Status";
  let statusText = `Your transaction is currently ${order.status}.`;

  if (isPaid) {
    statusIcon = <CheckCircle2 className="w-12 h-12" />;
    statusBg = "bg-emerald-50 text-emerald-500";
    statusTitle = "Payment Successful!";
    statusText = "Your registration payment has been successfully processed.";
  } else if (isPending) {
    statusIcon = <Loader2 className="w-12 h-12 animate-spin" />;
    statusBg = "bg-amber-50 text-amber-500";
    statusTitle = "Payment Pending";
    statusText = "We are waiting for the final confirmation from your bank.";
  } else if (isCancelled) {
    statusIcon = <XCircle className="w-12 h-12" />;
    statusBg = "bg-red-50 text-red-500";
    statusTitle = "Payment Failed";
    statusText = "The transaction was unsuccessful or cancelled.";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-gray-100 overflow-hidden print-card">
        {/* Status Header */}
        <div className="p-8 text-center border-b border-gray-50 flex flex-col items-center justify-center">
          <div className={`inline-flex p-3 rounded-full ${statusBg} mb-4 no-print-bg`}>
            {statusIcon}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{statusTitle}</h1>
          <p className="text-gray-500 text-sm max-w-sm">{statusText}</p>
        </div>

        {/* Transaction Details */}
        <div className="p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">Transaction Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100 print-grid">
            {order.user?.name && (
              <div className="md:col-span-2">
                <span className="text-gray-400 block text-xs uppercase font-medium">Student Name</span>
                <span className="text-gray-800 font-semibold text-base">{order.user.name}</span>
              </div>
            )}

            {order.notes?.product && (
              <div className="md:col-span-2">
                <span className="text-gray-400 block text-xs uppercase font-medium">Product / Course</span>
                <span className="text-gray-800 font-semibold text-base">{order.notes.product}</span>
              </div>
            )}

            <div>
              <span className="text-gray-400 block text-xs uppercase font-medium">Amount</span>
              <span className="text-gray-800 font-semibold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: order.currency || "INR",
                }).format(order.amount)}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-xs uppercase font-medium">Receipt</span>
              <span className="text-gray-800 font-semibold">{order.receipt}</span>
            </div>

            {order.paymentId && (
              <div>
                <span className="text-gray-400 block text-xs uppercase font-medium">Payment ID</span>
                <span className="text-gray-800 font-mono text-xs">{order.paymentId}</span>
              </div>
            )}

            <div>
              <span className="text-gray-400 block text-xs uppercase font-medium">Order ID</span>
              <span className="text-gray-800 font-mono text-xs">{order.orderId}</span>
            </div>

            {order.notes?.email && (
              <div>
                <span className="text-gray-400 block text-xs uppercase font-medium">Email</span>
                <span className="text-gray-800 font-medium">{order.notes.email}</span>
              </div>
            )}

            {order.notes?.contact && (
              <div>
                <span className="text-gray-400 block text-xs uppercase font-medium">Contact Number</span>
                <span className="text-gray-800 font-medium">{order.notes.contact}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 no-print">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="print-only-footer">
            Source : aceinstitution.com &nbsp;&nbsp;&nbsp;&nbsp; Date: {printDateTime.date} &nbsp;&nbsp;&nbsp;&nbsp; Time : {printDateTime.time}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .print-only-footer {
          display: none !important;
        }
        @media print {
          @page {
            margin: 0; /* Removes default browser headers and footers (date, title, URL) */
            size: auto;
          }
          /* Override all parent wrapper styles to prevent blank secondary pages */
          html, body, main, #__next, [data-reactroot] {
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }
          /* Hide non-printed layout components */
          header, footer, nav, aside, .no-print, button, a {
            display: none !important;
          }
          /* Card print-card layout overrides for absolute page placement */
          .print-card {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 1.5cm !important; /* Enforces page padding directly on the receipt card */
            width: 100% !important;
            max-width: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            page-break-inside: avoid !important;
          }
          /* Avoid background colors being stripped by browser default print settings */
          .no-print-bg {
            background-color: transparent !important;
            padding: 0 !important;
          }
          .print-grid {
            background-color: white !important;
            border: 1px solid #e5e7eb !important;
            padding: 1.5rem !important;
          }
          .print-only-footer {
            display: block !important;
            text-align: right !important;
            font-size: 10px !important;
            color: #9ca3af !important;
            font-family: monospace !important;
            margin-top: 2rem !important;
            border-top: 1px dashed #e5e7eb !important;
            padding-top: 1rem !important;
          }
        }
      `}} />
    </div>
  );
}

export default function TransactionCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        </div>
      }
    >
      <TransactionCompleteContent />
    </Suspense>
  );
}
