const express = require("express");
const router = express.Router();
const mediaController = require("../controller/mediaController");
const upload = require("../utils/uploadHelper");
const { isLoggedIn } = require("../middleware/authMiddleware");

// Upload single image (e.g., profile picture)
router.post("/upload-single", isLoggedIn, upload.single("image"), mediaController.uploadSingle);

// Upload multiple images (e.g., service gallery)
router.post("/upload-multiple", isLoggedIn, upload.array("images", 5), mediaController.uploadMultiple);

// Delete image
router.post("/delete", isLoggedIn, mediaController.deleteImage);

module.exports = router;
