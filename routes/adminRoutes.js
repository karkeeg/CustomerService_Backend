const router = require("express").Router();
const { getAllProviders, approveProvider } = require("../controller/adminController");
const { isAdmin } = require("../controller/userController");

router.get("/providers", isAdmin, getAllProviders);
router.put("/approve/:id", isAdmin, approveProvider);

module.exports = router;
