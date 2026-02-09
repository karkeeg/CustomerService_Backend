const router = require("express").Router();
const { updateProfile, createService, getProviderRequests, updateRequestStatus } = require("../controller/providerController");
const { isloggedIn } = require("../controller/userController");

router.post("/profile", isloggedIn, updateProfile);
router.post("/service", isloggedIn, createService);
router.get("/requests", isloggedIn, getProviderRequests);
router.put("/request-status", isloggedIn, updateRequestStatus);

module.exports = router;
