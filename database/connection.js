const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DATABASE CONNECTED SUCCESFULLY")
  })
  .catch((error) => {
    console.log("error:", error);
  });
