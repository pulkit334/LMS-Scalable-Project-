/* eslint-disable no-unused-vars */
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleauth } from "../../../../services/auth";
import { setToken } from "../../../../Slices/authslice";
import { setUser } from "../../../../Slices/profile";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function GoogleLoginButton({ accountType = "student" }) {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleauth(authResult["code"], accountType); //
        const { user, token } = result; //
        const { email, firstName, image } = user;
        dispatch(setToken(token));
        dispatch(setUser(user));
        Navigate("/")
      }
    } catch (err) {
      console.log("the error would be ", err.message);
      console.error("Error while requesting google code : ", err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      onClick={() => googleLogin()}
      className="flex items-center justify-center gap-2 w-full border py-2 rounded text-white"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="google"
        className="h-5"
      />
      Continue with Google
    </button>
  );
}

export default GoogleLoginButton;
