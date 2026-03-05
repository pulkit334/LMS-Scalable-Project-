// const VerifyOtp = () => {
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { sendotp, SinupUser } from "../../../services/auth";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  const { sinupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Guard
  useEffect(() => {
    if (!loading && !sinupData) {
      navigate("/signup");
    }
  }, [sinupData, loading, navigate]);

  // ⏱ Hide toast
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    const finalData = {
      ...sinupData,
      otp,
    };

    dispatch(SinupUser(finalData, navigate));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative">
      {/*  OTP SENT TOAST */}
      {showAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white">
              <Check size={14} />
            </span>
            <span>OTP Sent Successfully</span>
            {/* <button onClick={() => setShowAlert(false)}>
              <X size={14} />
            </button> */}
            <button
              onClick={async () => {
                if (!sinupData?.email) return;
                await sendotp({ email: sinupData.email });

                toast.success("OTP resent");
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {/*  OTP CARD */}
      <div className="bg-[#0b1220] border border-slate-700 rounded-2xl p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Verify OTP</h2>

        <p className="text-gray-400 text-sm mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus
            containerStyle="flex justify-between gap-4"
            renderInput={(props) => (
              <input
                {...props}
                className="h-10 w-[2em] rounded-md border border-gray-700 bg-[#020617] text-center text-lg text-white outline-none focus:border-yellow-400"
              />
            )}
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 py-2 rounded-md font-semibold text-black"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <Link to="/login">← Back to login</Link>
          {/* <button onClick={() => dispatch(sendotp(sinupData.email))}>
            Resend OTP
          </button> */}
          <button
            onClick={async () => {
              await sendotp({ email: sinupData.email });
              toast.success("OTP resent");
            }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

// };
