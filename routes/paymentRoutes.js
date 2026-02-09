// const express = require("express");
// const {
//   sendStripeKey,
//   processPayment,
// } = require("../controller/PaymentController");
// const router = express.Router();

// router.get("/getStripeKey", sendStripeKey);
// router.post("/create-payment-intent", processPayment);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createPayment,
  verifyPayment,
} = require("../controller/PaymentController");
const {
  EsewaInitiatePayment,
  paymentStatus,
} = require("../controller/EsewaController");
const { isloggedIn } = require("../controller/userController");

router.post("/esewa/create-payment", isloggedIn, createPayment);
router.get("/esewa/verify-payment", isloggedIn, verifyPayment);

router.post("/initiate-payment", isloggedIn, EsewaInitiatePayment);
router.post("/payment-status", isloggedIn, paymentStatus);

module.exports = router;
