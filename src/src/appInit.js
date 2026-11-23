
import { setToken } from "../src/Slices/authslice";
import { setUser } from "../src/Slices/profile";

export const hydrateAuth = (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token) {
    dispatch(setToken(token));
  }

  if (user) {
    dispatch(setUser(JSON.parse(user)));
  }
};
