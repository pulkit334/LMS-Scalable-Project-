import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BuyCourse } from "../../../../services/operations/studentPageAPi";
import { api } from "../../../../services/apiconnnector";
import toast from "react-hot-toast";
import { useEnrollment } from "../../../../context/enrollement";
import { addToCartAndSync } from "../../../../Slices/cartSlice";
import { fetchEnrolledCourses } from "../../../../Slices/EnroilledCourseSlice";
import PaymentModal from "../../../../components/PaymentModal";
import { CheckCircle2, PlayCircle, ShoppingCart, ShieldCheck, Clock, Monitor, Award } from "lucide-react";

const BuyCard = ({ course, content = [] }) => {
  const { enrolledCourseIds } = useEnrollment();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const courseId = course?._id;
  const [showPayGate, setShowPayGate] = useState(false);

  const isAlreadyEnrolled =
    enrolledCourseIds.some((id) => String(id) === String(courseId)) ||
    Boolean(
      user?._id &&
        course?.studentEnrolled?.some(
          (id) => String(id?._id || id) === String(user._id)
        )
    );

  const handleGoToCourse = () => {
    const sections =
      content?.length > 0 ? content : course?.courseContent || [];
    const firstSec = sections[0];
    const secId = typeof firstSec === "string" ? firstSec : firstSec?._id;
    const firstSub = firstSec?.subsection?.[0];
    const subId = typeof firstSub === "string" ? firstSub : firstSub?._id;

    if (secId && subId) {
      Navigate(`/view-course/${courseId}/section/${secId}/sub-section/${subId}`);
    } else if (secId) {
      Navigate(`/view-course/${courseId}/section/${secId}`);
    } else {
      Navigate("/dashboard/enrolled-courses");
    }
  };

  const HandleBuyCourse = () => {
    if (isAlreadyEnrolled) {
      handleGoToCourse();
      return;
    }
    BuyCourse(token, [courseId], user, Navigate, dispatch);
  };

  const addTocartHanlder = () => {
    if (!user || !user._id) {
      toast.error("Please login to add to cart");
      Navigate("/login");
      return;
    }
    if (isAlreadyEnrolled) {
      handleGoToCourse();
      return;
    }
    dispatch(addToCartAndSync(course, user._id));
  };

  return (
    <div className="w-full lg:w-[360px] bg-[#0b1220] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
      <div className="relative">
        <img
          src={course.thumbnail}
          className="w-full h-48 object-cover"
          alt={course.courseName || course.title || "Course thumbnail"}
        />
        {isAlreadyEnrolled && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/95 text-slate-950 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Already Enrolled
          </div>
        )}
      </div>

      <div className="px-6 pt-5 pb-6">
        {isAlreadyEnrolled ? (
          <>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-emerald-300">
                You own this course
              </p>
              <p className="text-xs text-emerald-200/75 mt-0.5">
                Jump right back into your lectures, AI notes, and quizzes.
              </p>
            </div>
            <button
              onClick={handleGoToCourse}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              Go to Course
            </button>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                ₹{course.price ?? 499}
              </h2>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Full Lifetime Access
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={HandleBuyCourse}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-amber-400/15 transition cursor-pointer"
              >
                Buy Now (Razorpay)
              </button>

              <button
                onClick={addTocartHanlder}
                className="w-full flex items-center justify-center gap-2 bg-white/[0.04] border border-white/10 text-slate-200 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/[0.08] transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-center mt-3.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              30-Day Money-Back Guarantee
            </p>
          </>
        )}

        <div className="mt-6 pt-5 border-t border-white/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            This course includes
          </h4>
          <ul className="text-sm text-slate-300 space-y-2.5">
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{course.totalDuration || "On-demand"} video lessons</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
              <span>AI lecture notes &amp; concept quizzes</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Full lifetime access &amp; completion tracking</span>
            </li>
          </ul>
        </div>
      </div>

      <PaymentModal
        open={showPayGate}
        onClose={() => setShowPayGate(false)}
        amount={course.price || 0}
        currency="INR"
        customerEmail={user?.email}
        metadata={{ courses: [courseId], userId: user?._id }}
        onSuccess={async ({ transactionId, orderId, paymentId }) => {
          try {
            await api.post(
              "/payment/enroll",
              {
                courses: [courseId],
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful via PayGate!");
            dispatch(fetchEnrolledCourses());
            Navigate("/dashboard/enrolled-courses");
          } catch (error) {
            toast.error(error?.response?.data?.message || "Enrollment failed");
          }
        }}
        onFailure={(error) => {
          toast.error(error || "Payment failed");
        }}
      />
    </div>
  );
};

export default BuyCard;
