  import { loginUser } from "../../services/auth";
  import { setUser } from "../../Slices/profile";
  import { setToken } from "../../Slices/authslice";
  import toast from "react-hot-toast";

  export const SubmitHandle = async (data, dispatch, navigate) => {
    try {
      const res = await loginUser(data);

      const token = res?.token;
      const user = res?.user;
console.log(user?.accountType)
      if (!user || !token) {
        toast.error("Invalid credentials");
        return;
      }
      console.log("Redirect role:", user.accountType);

      // Update Redux
      dispatch(setToken(token));
      dispatch(setUser(user));

      //  Persist token
      localStorage.setItem("token", token);

const role = user?.accountType?.trim()?.toLowerCase();
if (role === "admin") {
  console.log("Navigating to admin...");
  navigate("/admin/insight", { replace: true });
  return;
}


      toast.success("Login successful");

      //  Redirect based on role

      navigate("/"); // Student / default
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Invalid credentials";

      toast.error(message);
    }
  };
