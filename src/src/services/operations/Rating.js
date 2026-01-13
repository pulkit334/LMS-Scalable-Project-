/* eslint-disable no-useless-catch */
import { api } from "../apiconnnector";

const Rating = {
  CreateRating: "/courses/:courseId/ratings",
  
};

export const CreateRating = async ({ courseId, data }) => {
  try {
    const response = await api.post(
      Rating.CreateRating.replace(":courseId", courseId),
      data
    );
    return response.data;
  } catch (error) {
    console.log(error?.response?.data?.message || error.message);
    throw error;
  }
};
