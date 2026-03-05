import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { resetPassword } from "../services/operations/autapi"
import { Navigate } from "react-router-dom";
const UpdatePassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const { token } = useParams();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
   const success =  dispatch(resetPassword(password, confirmPassword, token));
   if(success){
    Navigate("/login")
   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="w-full max-w-105 bg-[#111827] rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Choose new password
          </h1>

          <p className="text-sm text-gray-400 mb-6">
            Almost done. Enter your new password and you’re all set.
          </p>

          <form onSubmit={handleOnSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <label className="block text-sm text-gray-300 mb-1">
                New password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                className="w-full rounded-md bg-[#1F2937] px-4 py-2 pr-10 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />

              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9.5 cursor-pointer text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm text-gray-300 mb-1">
                Confirm new password
              </label>

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                className="w-full rounded-md bg-[#1F2937] px-4 py-2 pr-10 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />

              <span
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-9.5 cursor-pointer text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-300 transition"
            >
              Reset Password
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

export default UpdatePassword;
