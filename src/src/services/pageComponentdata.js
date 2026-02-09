/* eslint-disable no-unused-vars */
import toast from "react-hot-toast";
import { api } from "./apiconnnector";

const getCatalogData = async (categoryid) => {
  const toastsid = toast.loading("Loading...");
  let result = [];
  try {
    const response = await api.post(
      "/course/getCategoryPageDetails",
      categoryid
    );
    console.log("the data would be ",response)
    if (!response?.data?.success) {
      throw new Error("Could No tFetch Category Page Data");
    }
    toast.success("Fetched Successfully", { id: toastsid });
    return response?.data;
  } catch (error) {
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastsid);
  return result;
};

export default getCatalogData;
