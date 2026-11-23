const express = require("express");
const router = express.Router();
const { auth, isstudent } = require("../middlewares/auth");
const {
  paygateCreateOrder,
  paygateVerifyPayment,
  paygateEnrollStudent,
  paygateWebhook,
} = require("../controllers/paygatePayment");

// PayGate proxy routes (used by PaymentModal)
router.post("/payment/create", auth, isstudent, paygateCreateOrder);
router.post("/payment/verify", auth, isstudent, paygateVerifyPayment);

// PayGate enrollment route
router.post("/enroll", auth, isstudent, paygateEnrollStudent);

// PayGate webhook (no auth — called by PayGate server)
router.post("/webhook", paygateWebhook);

module.exports = router;
