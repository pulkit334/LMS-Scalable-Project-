
import { loginUser } from "../../services/auth";
import { setUser } from "../../Slices/profile";
import { setToken } from "../../Slices/authslice";
import toast from "react-hot-toast";

export const SubmitHandle = async (data, dispatch, navigate) => {
  try {
    const res = await loginUser(data);
    console.log("LOGIN RESPONSE is", res);

    //  KEEPING EXACTLY AS YOU ASKED
    const { token } = res.user;
    const user = res?.user;

    //  Invalid credentials / bad response
    if (!user || !token) {
      toast.error("Invalid credentials");
      return;
    }
    //  Update Redux
    dispatch(setToken(token));
    dispatch(setUser(user));

    //  Persist token
    localStorage.setItem("token", token);

    toast.success("Login successful");

    //  Navigate only on success
    navigate("/");
  } catch (error) {
    console.log("Error While Logging", error);

    // THIS is why toast was not showing earlier
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Invalid credentials";

    toast.error(message);
  }
};
