const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      trim: true,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    maxPrice: {
      type: Number,
      required: true,
      default: 1000000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

//_id =  primary key - 24bit hex string
// timestamp : true -> adds 2 fields - createdAt ,updateAt
