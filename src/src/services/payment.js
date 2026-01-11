import { api } from "./apiconnnector";

export const CoursePayment = {
  GetBuyCourse: "/course/:courseId",
  GetCourseContent: "/course/:courseId/content",
  getPaymentCourseReviews: "/course/:courseId/reviews",
};


export const GetPayCourse = async (Course) => {
  const response = await api.get(
    CoursePayment.GetBuyCourse.replace(":courseId", Course)
  );
  console.log("The Pay coure api is ", response);
  return response?.data;
};
export const GetCourseContent = async (Course) => {

  const response = await api.get(
    CoursePayment.GetCourseContent.replace(":courseId",Course)
  );
  console.log("The Data of GetCourseContent ", response);
  return response?.data;
};

export const GetpaymentCourseData = async (Course) => {
  const response = await api.get(
    CoursePayment.getPaymentCourseReviews.replace(":courseId", Course)
  );
  console.log("the data of Course Payment api ",response);
  return response;
};


//raxer Pay Api 
export const studentEndPoints = {
  COURSE_PAYMENT_API : "/payment/capturePayment",
  COURE_VERIFY_API : "/payment/verifySignature",
  Payment_email_APi : "/send-payment-email"
}