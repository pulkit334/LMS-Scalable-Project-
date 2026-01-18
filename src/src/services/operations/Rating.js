/* eslint-disable no-useless-catch */
import { api } from "../apiconnnector";

const Rating = {
  CreateRating: "/courses/:courseId/ratings",
  GetALLRatings: "/courses/reviews",
  MyLectureReview: "/my-lecture/:courseId/coursereview",
  UpdationApi : "/update-review/:reviewId"
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

export const getRating = async () => {
  const response = await api.get(Rating?.GetALLRatings);
  console.log("the rating And Reviews are", response);
  return response?.data;
};
//my-lecture course Review
export const MyLectureReview = async (courseId) => {
  const response = await api.get(
    Rating.MyLectureReview.replace(":courseId", courseId)
  );
  // console.log("the repsonse of myLecture is")
  return response?.data?.data;
};
//updation api
export const UpdationApi = async ({reviewId,data})=>{
  const response = await  api.patch(Rating.UpdationApi.replace(":reviewId",reviewId),data);
  return response?.data;
}