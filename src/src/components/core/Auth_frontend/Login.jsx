/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { SubmitHandle } from "../../Auth/Auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import GoogleLoginButton from "../Auth_frontend/google/googleauth";

export const Login = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const handleFormChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center px-4 sm:px-6 overflow-y-auto">
      <div className="w-full max-w-6xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
        
        {/* ================= LEFT : LOGIN FORM ================= */}

        <div className="bg-[#161d29] flex flex-col gap-1 p-6 sm:p-8 md:p-10 rounded-xl text-white space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Welcome Back</h1>
            <p className="text-sm text-slate-400 mt-1">
              Discover your passion,{" "}
              <span className="text-cyan-400 font-semibold">
                Be Unstoppable
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-400">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formdata.email}
              onChange={handleFormChange}
              placeholder="Enter email address"
              className="w-full bg-[#0b1220] px-4 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-400">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formdata.password}
              onChange={handleFormChange}
              placeholder="Enter password"
              className="w-full bg-[#0b1220] px-4 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              SubmitHandle(
                {
                  email: formdata.email,
                  password: formdata.password,
                },
                dispatch,
                Navigate,
              );
            }}
            className="w-full bg-yellow-400 text-black py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
          >
            Sign In
          </button>

          <h2 className="font-light">
            Dont't have Account?{" "}
            <Link to="/signup">
              <span className="hover:text-sky-300">Sinup Now</span>
            </Link>
          </h2>

          <Link to="/forgot-password">
            <h2 className="text-blue-400">forgot Password</h2>
          </Link>

          {/* Google Button */}
          <GoogleLoginButton />

        </div>

        {/* ================= RIGHT : IMAGE SPACE ================= */}
        <div className="relative h-72 sm:h-96 md:h-[470px] rounded-3xl overflow-hidden flex items-center justify-center">
          <img
            src="/Images/login.webp"
            alt="Login illustration"
            className="h-full w-auto rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};