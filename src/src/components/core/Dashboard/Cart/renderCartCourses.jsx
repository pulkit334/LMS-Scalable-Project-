import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { IoIosStar } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { FiDelete } from "react-icons/fi";
import { removeFromCart } from "../../../../Slices/cartSlice";

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="space-y-6">
      {cart.map((course) => (
        <div
          key={course._id}
          className="flex flex-col sm:flex-row justify-between gap-6 rounded-xl bg-richblack-800 p-6"
        >
          {/* Left */}
          <div className="flex gap-5">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-28 w-44 rounded-lg object-cover"
            />

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{course.courseName}</h2>

              <p className="text-sm text-richblack-400">
                {course.category?.name}
              </p>

              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-200">4.5</span>
                <ReactStars
                  count={5}
                  size={18}
                  edit={false}
                  emptyIcon={<CiStar color="#999" />}
                  fullIcon={<IoIosStar color="#FFD700" />}
                />

                <span className="text-sm text-richblack-400">
                  ({course.ratingAndReviews?.length || 0} ratings)
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-row sm:flex-col justify-between items-end gap-4">
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-2 text-sm text-pink-300 hover:text-pink-400 transition"
            >
              <FiDelete />
              Remove
            </button>

            <p className="text-2xl font-semibold text-yellow-50">
              ₹ {course.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
