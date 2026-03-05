import { setToken } from "../src/Slices/authslice";

export const hydrateAuth = (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(setToken(token));
  }
};
