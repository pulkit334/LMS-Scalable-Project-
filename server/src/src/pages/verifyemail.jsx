import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { sendotp, SinupUser } from "../services/auth"; // your final API
import  { Toaster } from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");

  const { sinupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!sinupData){
        navigate("/signup")
    }
  })
  if (!sinupData) {
    navigate("/signup");
    return null;
  }

  const handleonsubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...sinupData,
      otp, //  OTP FROM LOCAL STATE
    };

    const data = dispatch(SinupUser(finalData, navigate)); //  FINAL API CALL
    if(data){
        Toaster.success("Successfully Registered")
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
      <div className="w-full max-w-md rounded-lg bg-[#0f172a] p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-semibold">Verify email</h1>
        <p className="mb-6 text-sm text-gray-400">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleonsubmit} className="space-y-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus
            containerStyle="flex justify-between"
            renderInput={(props) => (
              <input
                {...props}
                className="h-12 w-12 rounded-md border border-gray-700 bg-[#020617] text-center text-lg text-white focus:border-yellow-400 outline-none"
              />
            )}
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 py-2 rounded-md font-semibold text-black"
          >
            Verify Email
          </button>
        </form>

        <div  className="mt-6 flex justify-between text-sm text-gray-400">
          <Link to="/login">← Back to login</Link>
          <button onClick={()=>dispatch(sendotp(sinupData.email))} >Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
