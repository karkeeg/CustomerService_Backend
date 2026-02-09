const express = require("express");
const {
  addCategory,
  getAllCategories,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const { isloggedIn, isAdmin } = require("../controller/userController");
const {
  categoryCheck,
  validationMethod,
} = require("../middleware/validationScript");

const router = express.Router();

router.post(
  "/addcategory",
  isAdmin,
  categoryCheck,
  validationMethod,
  addCategory
);
router.get("/getAllCategories", getAllCategories);
// router.get('/getCategoriesDetail',getCategoryDetails)
router.get("/getCategoriesDetail/:id", getCategoryDetails);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;
