import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BuyCourse } from "../../../../services/operations/studentPageAPi";
import toast from "react-hot-toast";
import { useEnrollment } from "../../../../context/enrollement";
import {addToCartAndSync} from "../../../../Slices/cartSlice";

const BuyCard = ({ course }) => {
  const { enrolledCourseIds } = useEnrollment();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const courseId = course?._id;
  
  const isAlreadyEnrolled = enrolledCourseIds.some(
    (id) => String(id) === String(courseId),
  );
  
  const HandleBuyCourse = () => {
    if (isAlreadyEnrolled) {
      toast.error("Already enrolled in the course");
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
      toast.error("Already enrolled in the course");
      return;
    }
    dispatch(addToCartAndSync(course, user._id));
  };
  
  return (
    <div className="w-[360px] bg-[#020617] rounded-xl shadow-2xl overflow-hidden">
      <img
        src={course.thumbnail}
        className="w-full h-48 object-cover"
        alt={course.title}
      />

      <div className="px-5 pt-4 pb-5">
        <h2 className="text-3xl font-bold mb-4">
          ₹ {course.price}
        </h2>

        <button
          onClick={HandleBuyCourse}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2.5 rounded-md font-semibold mb-2 transition"
        >
          Buy Now
        </button>

        <button
          onClick={addTocartHanlder}
          className="w-full bg-[#111827] border border-gray-700 py-2.5 rounded-md font-semibold hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>

        <p className="text-[11px] text-center mt-3 text-gray-400">
          30-Day Money-Back Guarantee
        </p>

        <div className="mt-5">
          <h4 className="text-sm font-semibold mb-2">
            This course includes:
          </h4>

          <ul className="text-sm text-gray-300 space-y-1">
            <li>✔ 8 hours on-demand video</li>
            <li>✔ Full lifetime access</li>
            <li>✔ Access on mobile and TV</li>
            <li>✔ Certificate of completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuyCard;