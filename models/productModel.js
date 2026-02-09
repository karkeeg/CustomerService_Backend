const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_price: {
      type: Number,
      required: true,
      trim: true,
    },
    product_description: {
      type: String,
      required: true,
      trim: true,
    },
    count_in_stock: {
      type: Number,
      required: true,
      trim: true,
    },
    product_image: {
      type: String,
    },
    product_rating: {
      type: Number,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
