const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

//_id =  primary key - 24bit hex string
// timestamp : true -> adds 2 fields - createdAt ,updateAt
