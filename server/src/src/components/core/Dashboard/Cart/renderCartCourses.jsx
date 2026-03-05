import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component"
import { IoIosStar } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { FiDelete } from "react-icons/fi";

import { removeFromCart } from "../../../../Slices/cartSlice";
const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  return (
    <div>
      {cart.map((course, index) => {
        //change the Index to item._id
        //avg rating
        <div key={index}>
          <div>
            <img src={course?.thumbnail} alt="" />
            <div>
              <p>{course?.coureName}</p>
              <p>{course?.category?.name}</p>
              <div>
                <span>4.5</span>
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<CiStar />}
                  fullIcon={<IoIosStar />}
                />
                <span> {course?.ratingAndReviews?.length} Ratings </span>
              </div>
            </div>
          </div>

          <div>
            <button onClick={dispatch(removeFromCart(course._id))}>
              <FiDelete />
              <span>
                <Remove></Remove>
              </span>
            </button>
            <p>Rs {course?._id}</p>
          </div>
        </div>;
      })}
    </div>
  );
};

export default RenderCartCourses;
