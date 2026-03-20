/* eslint-disable no-unused-vars */
import toast from "react-hot-toast";
import { setloading } from "../../Slices/authslice";
import { api } from "../apiconnnector";
import { AUTH } from "../auth";
// import { redirect } from "react-router-dom";

export function getpasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setloading(true));
    try {
      const response = await api.post(AUTH.FORGOT_PASSWORD, { email });
if (!response?.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("REset Email sent");
      setEmailSent(true);
    } catch (erorr) {
toast.error("Failed to Send Email For Reseting the Password");
    }
    dispatch(setloading(false));
  };
}

export function resetPassword(password, confirmpassword, token) {
  return async (dispatch) => {
    dispatch(setloading(true));

    try {
    
      const response = await api.post(AUTH.RESET_PASSWORD, {
        password,
        confirmpassword,
        token,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Reset failed");
      }

      toast.success("Password reset successfully");
      return true; 
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Error while resetting password"
      );
            return false;
    } finally {
      dispatch(setloading(false));
    }
  };
}
