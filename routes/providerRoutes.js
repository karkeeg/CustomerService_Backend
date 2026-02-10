const router = require("express").Router();
const { 
  updateProfile, 
  getProviderServices,
  createService, 
  updateService,
  deleteService,
  getProviderRequests, 
  updateRequestStatus 
} = require("../controller/providerController");
const { isloggedIn } = require("../controller/userController");

router.post("/profile", isloggedIn, updateProfile);
router.get("/services", isloggedIn, getProviderServices);
router.post("/service", isloggedIn, createService);
router.put("/service/:id", isloggedIn, updateService);
router.delete("/service/:id", isloggedIn, deleteService);
router.get("/requests", isloggedIn, getProviderRequests);
router.put("/request-status", isloggedIn, updateRequestStatus);

module.exports = router;
