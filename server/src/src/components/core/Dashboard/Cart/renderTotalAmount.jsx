import React from "react";
import { useSelector } from "react-redux";
import IconButton from "../../common/iconButton";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const handleBuyCourse = () => {
    const courses = cart.map((courses) => courses._id);
    console.log("Bougth theses Courses", courses);
  };
  return (
    <div>
      <p>Total:</p>
      <p>rs {total}</p>
      <IconButton
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses={"w-full justify-center"}
      />
    </div>
  );
};

export default RenderTotalAmount;
