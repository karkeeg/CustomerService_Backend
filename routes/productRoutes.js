const {
  addProduct,
  getAllProduct,
  getProductDetails,
  getProductByCategory,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
  getRelatedProducts,
  getTrendingProducts,
} = require("../controller/productController");
const { isAdmin } = require("../controller/userController");
const upload = require("../middleware/fileUpload");
const {
  productCheck,
  validationMethod,
} = require("../middleware/validationScript");

const router = require("express").Router();

// router.post("/product", addProduct);
// router.get("/productDetails", getAllProduct);
// router.get("/product/:id", getProductDetails);
// router.get("/getProductByCategoty/:categoryId", getProductByCategory);
// router.put("/updateProduct/:id", updateProduct);
// router.delete("/deleteProduct/:id", deleteProduct);

// we can name the endpoint by same name like in the below
router.post(
  "/product",
  upload.single("product_image"),
  isAdmin,
  productCheck,
  validationMethod,
  addProduct
);
router.get("/product", getAllProduct);
router.get("/product/:id", getProductDetails);
router.put(
  "/product/:id",
  upload.single("product_image"),
  isAdmin,
  updateProduct
);
router.delete("/product/:id", deleteProduct);

//but its hard to do because end point will be diffcuult to remember
router.get("/getProductByCategoty/:categoryId", getProductByCategory);

router.post("/getFilteredProducts", getFilteredProducts);
router.get("/getrelatedproducts/:id", getRelatedProducts);
router.get("/getTrendingProducts", getTrendingProducts);

module.exports = router;
