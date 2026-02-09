const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./database/connection");
const cors = require("cors");

const path = require("path");

const providerRoutes = require("./routes/providerRoutes");
const consumerRoutes = require("./routes/consumerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/admin", adminRoutes);

// Retaining legacy routes for a while (optional)
// app.use(categoryRouter);
// app.use(productRouter);
// app.use(orderRouter);
// app.use(paymentRouter);

// Serve React build files
app.use(express.static(path.join(__dirname, "../myreact-project/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../myreact-project/dist", "index.html"));
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Serveer Started successfully at port " + port);
});
