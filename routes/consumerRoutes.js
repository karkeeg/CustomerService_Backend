const router = require("express").Router();
const { getAllServices, requestService, getMyRequests, cancelRequest } = require("../controller/consumerController");
const { isLoggedIn, isConsumer } = require("../middleware/authMiddleware");

router.get("/services", getAllServices);
router.post("/request", isLoggedIn, isConsumer, requestService);
router.get("/my-requests", isLoggedIn, isConsumer, getMyRequests);
router.delete("/request/:id", isLoggedIn, isConsumer, cancelRequest);

module.exports = router;
