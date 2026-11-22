import { useState } from "react";
import { X, Loader, CheckCircle, XCircle } from "lucide-react";
import { api } from "../services/apiconnnector";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
  onSuccess?: (data: { transactionId: string; orderId: string; paymentId: string }) => void;
  onFailure?: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal = ({
  open,
  onClose,
  amount,
  currency = "INR",
  customerEmail,
  metadata,
  onSuccess,
  onFailure,
}: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  if (!open) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setStatus("processing");

    try {
      const orderRes = await api.post(
        "../v6/payment/create",
        {
          amount: Math.round(amount * 100),
          currency,
          metadata,
        }
      );

      const { orderId, razorpayKey } = orderRes.data;

      const options = {
        key: razorpayKey,
        amount: Math.round(amount * 100),
        currency,
        name: "Notion-X",
        description: "Course Purchase",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post("../v6/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setStatus("success");
            onSuccess?.({
              transactionId: verifyRes.data.transactionId || response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
            });
          } catch {
            setStatus("failed");
            setError("Payment verification failed");
            onFailure?.("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus("idle");
          },
        },
        prefill: {
          email: customerEmail || "",
        },
        theme: {
          color: "#6C63FF",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        setStatus("failed");
        setError(response.error?.description || "Payment failed");
        onFailure?.(response.error?.description || "Payment failed");
      });
      razorpay.open();
    } catch (err: any) {
      setStatus("failed");
      setError(err.response?.data?.error || "Failed to create payment order");
      onFailure?.(err.response?.data?.error || "Failed to create payment order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f172a] border border-gray-700 rounded-[10px] max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
            <p className="text-sm text-gray-400 mb-6">Your transaction has been processed.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-lg text-sm font-medium transition-all"
            >
              Done
            </button>
          </div>
        ) : status === "failed" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Payment Failed</h3>
            <p className="text-sm text-red-400 mb-6">{error || "Something went wrong"}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setStatus("idle"); setError(""); }}
                className="px-6 py-2.5 bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-lg text-sm font-medium transition-all"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Amount</span>
                <span className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount)}
                </span>
              </div>
              {customerEmail && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <span className="text-sm text-gray-400">Customer</span>
                  <span className="text-sm text-white">{customerEmail}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full px-6 py-3 bg-[#6C63FF] hover:bg-[#5a52e0] disabled:opacity-50 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              {loading
                ? "Processing..."
                : `Pay ${new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount)}`}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secured by Razorpay · Powered by PayGate
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
