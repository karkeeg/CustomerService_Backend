const {
  register,
  verifyUser,
  resendVerification,
  resetPassword,
  forgetPassword,
  getAllUsers,
  getSingleUser,
  login,
  updateUser,
  deleteUser,
  getUser,
  getUserById,
  changeRole,
  verifyUserByAdmin,
  isAdmin,
} = require("../controller/userController");
const {
  userRegisterCheck,
  validationMethod,
  userLoginCheck,
} = require("../middleware/validationScript");

const router = require("express").Router();

router.post("/register", userRegisterCheck, validationMethod, register);
router.get("/verify/:token", verifyUser);
router.post("/resendVerification", resendVerification);
router.post("/forgotPassword", userRegisterCheck, forgetPassword);
router.post("/resetPassword/:token", userRegisterCheck, resetPassword);

router.get("/getAllUsers", getAllUsers);
router.get("/getSingleUser", getSingleUser);
router.get("/getUserById/:id", getUserById);

router.post("/login", userLoginCheck, login);
router.put("/updateUser/:id", updateUser);
router.post("/deleteUser/:id", deleteUser);
router.post("/getUser", getUser);

router.put("/changerole/:id", isAdmin, changeRole);
router.post("/verifyuserbyadmin/:id", isAdmin, verifyUserByAdmin);

module.exports = router;
