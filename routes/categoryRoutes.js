const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

router.get("/", categoryController.getAllCategories);
router.post("/", isLoggedIn, isAdmin, categoryController.createCategory);
router.put("/:id", isLoggedIn, isAdmin, categoryController.updateCategory);
router.delete("/:id", isLoggedIn, isAdmin, categoryController.deleteCategory);

module.exports = router;
