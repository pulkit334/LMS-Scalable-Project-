const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses", //
      required: true,
      index: true,
    },

    price: { type: Number, default: 0 },

    paymentid: { type: String, required: true },
    orderid: { type: String, required: true },

    signature: { type: String, required: false }, //

    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
