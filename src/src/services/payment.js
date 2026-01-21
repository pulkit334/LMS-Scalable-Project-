import { api } from "./apiconnnector";

export const CoursePayment = {
  GetBuyCourse: "/course/:courseId",
  GetCourseContent: "/course/:courseId/content",
  getPaymentCourseReviews: "/course/:courseId/reviews",
  getCourseReviews: "/payment-review/:courseId/review",
  GetPaymentHistory : "/user/purchased-history",
};
export const paymentcoursereview = async (course) => {
  const response = await api.get(
    CoursePayment.getCourseReviews.replace(":courseId", course),
  );
  console.log("the Other Log DAta will be tsdssssssssssssssssssssssssssssssssssssssshe Main Data",response?.data)
  return response?.data;
};

export const GetPayCourse = async (Course) => {
  const response = await api.get(
    CoursePayment.GetBuyCourse.replace(":courseId", Course),
  );
  // console.log("the getPayment Course Api", response);
  return response?.data;
};
export const GetCourseContent = async (Course) => {
  const response = await api.get(
    CoursePayment.GetCourseContent.replace(":courseId", Course),
  );
  // console.log("The Data of GetCourseContent ", response);
  return response?.data;
};

export const GetpaymentCourseData = async (Course) => {
  const response = await api.get(
    CoursePayment.getPaymentCourseReviews.replace(":courseId", Course),
  );
  // console.log("the data of Course Payment In backedn  api ", response);
  return response;
};


export const GetPaymentHistory  = async()=>{
  const response = await api.get(CoursePayment?.GetPaymentHistory)
  return response?.data;
}

//raxer Pay Api
export const studentEndPoints = {
  COURSE_PAYMENT_API: "/payment/capturePayment",
  COURE_VERIFY_API: "/payment/verifySignature",
  Payment_email_APi: "/send-payment-email",
};
