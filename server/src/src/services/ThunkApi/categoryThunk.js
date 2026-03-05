/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { GetCategorires } from "../../services/auth";
import {
  setCategoryLoading,
  setCategories,
  setCategoryError,
} from "../../Slices/profile";

const fetchCategories = () => async (dispatch, getState) => {
  const { status } = getState().profile;

  // prevent duplicate API calls
  if (status !== "idle") return;

  try {
    dispatch(setCategoryLoading());

    const categories = await GetCategorires(); // API call

    dispatch(setCategories(categories)); // store globally
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};
export default fetchCategories;
