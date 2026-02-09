const { check, validationResult } = require("express-validator");

const categoryCheck = [
  check("category_name", "Category is required")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),
];

const categoryUpdateCheck = [
  check("category_name", "Category is required")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),
];

const productCheck = [
  check("product_name", "Product name is required")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters long"),
  check("product_price", "Product price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("product_description", "Description is required")
    .notEmpty()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),
  check("category", "Product category is required")
    .notEmpty()
    .isMongoId()
    .withMessage("Product category must be a valid MongoDB ID"),
  check("count_in_stock", "Product quantity is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
];
const userRegisterCheck = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Username must not exceed 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .not()
    .isIn(["admin", "root"])
    .withMessage("Username cannot be 'admin' or 'root'"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 28 })
    .withMessage("Password must not exceed 28 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()\-_=+{};:,<.>]/)
    .withMessage("Password must contain at least one special character"),
];

const userLoginCheck = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid emaiil address")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 28 })
    .withMessage("Password must not exceed 28 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()\-_=+{};:,<.>]/)
    .withMessage("Password must contain at least one special character"),
];

const validationMethod = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg, // simplified key: "error"
    });
  }
  next();
};

module.exports = {
  categoryCheck,
  validationMethod,
  categoryUpdateCheck,
  productCheck,
  userRegisterCheck,
  userLoginCheck,
};
