const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./database/connection");
const cors = require("cors");
const multer = require("multer");

const path = require("path");

const providerRoutes = require("./routes/providerRoutes");
const consumerRoutes = require("./routes/consumerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mediaRoutes = require("./routes/mediaRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/media", mediaRoutes);

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

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
  next();
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Serveer Started successfully at port " + port);
});
