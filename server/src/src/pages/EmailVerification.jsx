import React, { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyRecoveryToken } from "../services/auth";
import toast from "react-hot-toast";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  // loading | success | error

 const hasRun = useRef(false);

useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  const verify = async () => {
    try {
      const res = await verifyRecoveryToken(token);

      if (res?.data?.success) {
        setStatus("success");
        toast.success(res.data.message);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      toast.error(
        error?.response?.data?.message ||
          "This recovery link is invalid or expired."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  };

  if (token) verify();
}, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-6">
      <div className="w-full max-w-md rounded-xl bg-[#161d29] p-8 shadow-2xl text-white text-center">
        <div className="text-4xl mb-4">
          {status === "loading" && "🔐"}
          {status === "success" && "✅"}
          {status === "error" && "⚠️"}
        </div>

        <h1 className="text-xl font-semibold mb-2">
          {status === "loading" && "Verifying your recovery link"}
          {status === "success" && "Your account has been reactivated"}
          {status === "error" && "This recovery link is no longer valid"}
        </h1>

        <p className="text-sm text-slate-400">
          {status === "loading" &&
            "Please wait while we securely verify your request."}

          {status === "success" && "You can now sign in to your account."}

          {status === "error" &&
            "The link may have expired or already been used."}
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
