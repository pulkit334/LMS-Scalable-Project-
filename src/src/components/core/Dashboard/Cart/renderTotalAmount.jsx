import { useDispatch, useSelector } from "react-redux";
import { BuyCourse } from "../../../../services/operations/studentPageAPi";
import { useNavigate } from "react-router-dom";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
  const Navigate = useNavigate();
  const HandleBuyCourse = () => {
    const CourseIds = cart.map((course)=>course._id)
    BuyCourse(token, CourseIds, user, Navigate, dispatch);
  };
  return (
    <div className="sticky top-24 rounded-xl bg-richblack-800 p-6 h-fit">
      <p className="text-sm text-richblack-400 mb-1">Total Amount</p>

      <p className="text-4xl font-bold text-yellow-50 mb-6">₹ {total}</p>

      <button
        onClick={() => HandleBuyCourse()}
        className="w-full rounded-lg bg-yellow-50 py-3 text-lg font-semibold text-black hover:bg-yellow-100 transition"
      >
        Buy Now
      </button>

      <p className="mt-4 text-xs text-richblack-400 text-center">
        Secure checkout • Instant access
      </p>
    </div>
  );
};

export default RenderTotalAmount;
