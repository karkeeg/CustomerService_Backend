const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { isAdmin, isLoggedIn } = require("../middleware/authMiddleware");

router.get("/stats", isLoggedIn, isAdmin, adminController.getDashboardStats);
router.get("/providers", isLoggedIn, isAdmin, adminController.getAllProviders);
router.get("/consumers", isLoggedIn, isAdmin, adminController.getAllConsumers);
router.get("/services", isLoggedIn, isAdmin, adminController.getAllServices); // Changed to use adminController.getAllServices
router.put("/approve/:id", isLoggedIn, isAdmin, adminController.approveProvider);
router.put("/services/:id/moderation", isLoggedIn, isAdmin, adminController.updateServiceModerationStatus); // Added new route
router.delete("/services/:id", isLoggedIn, isAdmin, adminController.deleteService); // Changed path to /services/:id and handler to adminController.deleteService
router.delete("/user/:id", isLoggedIn, isAdmin, adminController.deleteUser);
router.put("/user/:id", isLoggedIn, isAdmin, adminController.updateUser);

module.exports = router;
