import toast from "react-hot-toast";
import { getMyProfile } from "../services/auth";
import { setUser } from "../Slices/profile";

export const restoreUser = async (dispatch) => {
  try {
    const res = await getMyProfile();
    const user = res?.userdetails;
    if (!user) {
      console.log("No user found in restore response", res?.userdetails);
      return;
    }

    dispatch(setUser(user));
    return user;
  } catch (error) {
   toast.error("Error While Fetching",error)
  }
};
