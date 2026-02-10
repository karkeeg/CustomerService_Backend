const router = require("express").Router();
const { getAllServices, requestService, getMyRequests, cancelRequest } = require("../controller/consumerController");
const { isloggedIn } = require("../controller/userController");

router.get("/services", getAllServices);
router.post("/request", isloggedIn, requestService);
router.get("/my-requests", isloggedIn, getMyRequests);
router.delete("/request/:id", isloggedIn, cancelRequest);

module.exports = router;
