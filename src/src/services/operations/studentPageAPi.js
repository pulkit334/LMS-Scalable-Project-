/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//load the script
//for opening modal create the options
import toast from "react-hot-toast";
import { CoursePayment, studentEndPoints } from "../payment";
import { api } from "../apiconnnector";
import { Currency } from "lucide-react";
import rpz_logo from "../../assets/Logo/rzp_logo.png";
const { COURSE_PAYMENT_API, COURE_VERIFY_API, Payment_email_APi } =
  studentEndPoints;

import { setPaymentLoading } from "../../Slices/courseSlice";
import { resetCart } from "../../Slices/cartSlice";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function BuyCourse(
  token,
  courses,
  userDetails,
  disptach,
  Navigate
) {
  const toastId = toast.loading("Loading...");
  try {
    //load the script

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("RazerPay SDK Failed to load");
      return;
    }
    //intitiate the order
    const orderResponse = await api.post(
      COURSE_PAYMENT_API,
      { courses },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(
      "The response of After Payment Capture would be",
      orderResponse
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      currency: orderResponse?.data?.currency,

      amount: Number(orderResponse?.data?.amount),
      order_id: orderResponse?.data?.orderId,
      name: "StudyNotion",
      description: "Thanku For Puchasing The Course",
      image: rpz_logo,

      prefill: {
        name: `${userDetails.firstName}`,
        email: `${userDetails.email}`,
      },

      handler: function (response) {
        console.log("the Handller Response is", response);
        // SendPaymentSuccessEmail(response, orderResponse?.data?.amount, token);
        //verify the payment
        VerifyPayment({ ...response, courses }, token, Navigate, disptach);
      },
    };
    console.log("OPTIONS:", options);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      disptach(setPaymentLoading(false));
    });
  } catch (error) {
    console.log("Payment Api Error", error);
    toast.error("Could Not Make Payment");
  }
  toast.dismiss();
}

async function SendPaymentSuccessEmail(response, amount, token) {
  try {
    const res = await api.post(
      Payment_email_APi,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.log(
      "Payment Success Email Error",
      err?.response?.data || err.message
    );
  }
}

async function VerifyPayment(bodyData, token, Navigate, disptach) {
  const toastId = toast.loading("verifying Payment...");
  disptach(setPaymentLoading(true));
  try {
    const response = await api.post(COURE_VERIFY_API, bodyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("The Repsons eof the verify Payment would be ", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Payment Successfully");
    window.location.href = "/dashboard/enrolled-courses";

    // window.location.href = "/dashboard/enrolled-courses"
    disptach(resetCart());
  } catch (error) {
    toast.error("COuld Not Verify Payment");
  }
  toast.dismiss(toastId);
  disptach(setPaymentLoading(false));
}
