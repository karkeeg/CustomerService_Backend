const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// All notification routes require authentication
router.use(isLoggedIn);

router.get("/", notificationController.getUserNotifications);
router.put("/:id/read", notificationController.markAsRead);
router.post("/push-token", notificationController.updatePushToken);
router.put("/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
