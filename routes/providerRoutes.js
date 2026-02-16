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
const { isLoggedIn, isProvider } = require("../middleware/authMiddleware");

router.post("/profile", isLoggedIn, isProvider, updateProfile);
router.get("/services", isLoggedIn, isProvider, getProviderServices);
router.post("/service", isLoggedIn, isProvider, createService);
router.put("/service/:id", isLoggedIn, isProvider, updateService);
router.delete("/service/:id", isLoggedIn, isProvider, deleteService);
router.get("/requests", isLoggedIn, isProvider, getProviderRequests);
router.put("/request-status", isLoggedIn, isProvider, updateRequestStatus);

module.exports = router;
