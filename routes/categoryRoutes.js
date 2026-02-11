const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
// const { protect } = require("../middleware/authMiddleware"); // Optional: if we want to protect creation

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory); // Open for now, or add protect middleware

module.exports = router;
