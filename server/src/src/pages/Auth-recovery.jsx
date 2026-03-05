/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { UndoAccount } from "../services/auth";
import toast from "react-hot-toast";


const Authrecovery = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
let data 
    try {
      let toastid;
      if (!email) return;
      if (!email || !email.endsWith("@gmail.com")) {
        toast.error("Please enter a valid gmail address");
        return;
      }
      toastid = toast.loading("Processing Request...");
      // for now, just console log
      const response = await UndoAccount(email);
      if (response?.success) {
        toast.success(response?.message, toastid);

        setTimeout(() => {
          toast.loading("Redirecting You To Login Page");

          window.location.href = "/login";
        }, 4000);
      }
    } catch (error) {
      toast.error("Failed to Recover The Account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-6">
      <div className="w-full max-w-md rounded-xl bg-[#161d29] p-8 shadow-2xl text-white">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Enter your email</h1>
          <p className="mt-2 text-sm text-slate-400">
            Please enter the email associated with your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-[#0b1220] px-4 py-2 text-white outline-none border border-slate-700 focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-yellow-400 py-2 font-semibold text-black transition hover:bg-yellow-300"
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-xs text-slate-500 text-center">
          Make sure you have access to this email address.
        </p>
      </div>
    </div>
  );
};

export default Authrecovery;
