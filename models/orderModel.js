const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: ObjectId,
        ref: "OrderItems",
      },
    ],
    user: {
      type: ObjectId,
      ref: "user",
    },
    total: {
      type: Number,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
