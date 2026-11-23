
import { useSelector } from "react-redux";
import RenderCartCourses from "./renderCartCourses";
import RenderTotalAmount from "./renderTotalAmount";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Your Cart</h1>
        <p className="text-richblack-300 mt-2">
          {totalItems} Course{totalItems !== 1 && "s"} in cart
        </p>
      </div>

      {total > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2">
            <RenderCartCourses />
          </div>

          {/* Right */}
          <RenderTotalAmount />
        </div>
      ) : (
        <div className="rounded-xl bg-richblack-800 p-10 text-center">
          <p className="text-richblack-300">
            Your cart is empty. Start learning today 🚀
          </p>
        </div>
      )}
    </div>
  );
}
