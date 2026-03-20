
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
