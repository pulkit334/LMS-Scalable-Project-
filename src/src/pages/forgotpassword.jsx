import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { EmailReset } from "../services/auth";
import { getpasswordResetToken } from "../services/operations/autapi";
const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getpasswordResetToken(email, setEmailSent));
    // API call will go here
    // dispatch(EmailReset(email));

    setEmailSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
      {loading ? (
        <div className="text-white text-lg">Loading...</div>
      ) : (
        <div className="w-full max-w-105 bg-[#111827] rounded-lg p-8 shadow-lg">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-white mb-2">
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-6">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email, we can try account recovery."
              : `We have sent the reset email to ${email}`}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!emailSent && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-md bg-[#1F2937] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-300 transition"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
