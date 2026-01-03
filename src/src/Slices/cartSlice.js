// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   totalItems: localStorage.getItem("totalItems")
//     ? JSON.parse(localStorage.getItem("totalItems"))
//     : 0,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     setTotalItems(state, action) {
//       state.totalItems = action.payload;
//       localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
//     },
//     resetCart(state) {
//       state.totalItems = 0;
//       localStorage.removeItem("totalItems");
//     },
//   },
// });

// export const { setTotalItems, resetCart } = cartSlice.actions;
// export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],

  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,

  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const course = action.payload;

      const index = state.cart.findIndex(
        (item) => item._id === course._id
      );

      if (index >= 0) {
        toast.error("Course already in cart");
        return;
      }

      state.cart.push(course);
      state.totalItems += 1;
      state.total += course.price;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      localStorage.setItem("total", JSON.stringify(state.total));

      toast.success("Added to cart");
    },

    removeFromCart(state, action) {
      const courseId = action.payload;

      const index = state.cart.findIndex(
        (item) => item._id === courseId
      );

      if (index >= 0) {
        state.totalItems -= 1;
       state.total -= state.cart[index].price 
        state.cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        localStorage.setItem("total", JSON.stringify(state.total));
      }
    },

    resetCart(state) {
      state.cart = [];
      state.totalItems = 0;
      state.total = 0;

      localStorage.removeItem("cart");
      localStorage.removeItem("totalItems");
      localStorage.removeItem("total");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
