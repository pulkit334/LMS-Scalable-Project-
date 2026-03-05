/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import RenderCartCourses from "./renderCartCourses";
import RenderTotalAmount from "./renderTotalAmount";
export default function Cart() {
  const { total, totalItems } = useSelector((state) => (state) => state.cart);
  return (
    <div className="text-white">
      <p>Your Cart</p>
      <p>{totalItems} Course in cart</p>
      {total > 0 ? (
        <div>
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p>Add Courses to Show Courses</p>
      )}
    </div>
  );
}
