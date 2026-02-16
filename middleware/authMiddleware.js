const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Middleware to check if user is logged in
exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedData._id);

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  console.log("Checking admin access for user:", req.user?._id, "Role:", req.user?.role);
  if (req.user.role !== "admin") {
    console.log("Access denied: User is not an admin. Role found:", req.user.role);
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }

  next();
};

// Middleware to check if user is a provider or admin
exports.isProvider = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (req.user.role !== "provider" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Provider or Admin role required." });
  }

  next();
};

// Middleware to check if user is a consumer or admin
exports.isConsumer = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (req.user.role !== "consumer" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Consumer or Admin role required." });
  }

  next();
};
