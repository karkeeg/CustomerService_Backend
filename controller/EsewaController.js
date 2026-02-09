const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");
const TransactionModel = require("../models/TransactionModel");
const crypto = require("crypto");

// Utils: Generate a unique UUID
const generateTransactionUUID = () =>
  `${Date.now()}${crypto.randomBytes(4).toString("hex")}`;

// INITIATE PAYMENT
exports.EsewaInitiatePayment = async (req, res) => {
  const { amount, productId } = req.body;

  if (!amount || !productId) {
    return res.status(400).json({ error: "Missing amount or productId" });
  }

  const transaction_uuid = generateTransactionUUID();

  try {
    const productCode = productId || "DEFAULT_CODE";

    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      productCode, // product code
      process.env.MERCHANT_ID, // merchant ID
      process.env.SECRET, // ✅ secret key here!
      process.env.SUCCESS_URL, // success
      process.env.FAILURE_URL, // failure
      process.env.ESEWAPAYMENT_URL, // endpoint
      transaction_uuid // ✅ now use UUID here
    );

    if (!reqPayment || reqPayment.status !== 200) {
      return res
        .status(400)
        .json({ error: "Failed to initiate eSewa payment" });
    }

    // Save transaction to DB
    const transaction = new TransactionModel({
      transaction_uuid,
      product_id: productId,
      amount,
      status: "PENDING",
    });

    await transaction.save();

    // Redirect URL from eSewa
    return res.status(200).json({
      url: reqPayment.request.res.responseUrl,
      transaction_uuid,
    });
  } catch (error) {
    console.error("EsewaInitiatePayment error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// VERIFY STATUS
exports.paymentStatus = async (req, res) => {
  const { transaction_uuid } = req.body;

  if (!transaction_uuid) {
    return res.status(400).json({ error: "Missing transaction_uuid" });
  }

  try {
    const transaction = await TransactionModel.findOne({ transaction_uuid });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const statusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.transaction_uuid,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (statusCheck.status === 200) {
      transaction.status = statusCheck.data.status || "PENDING";
      await transaction.save();

      return res.status(200).json({
        message: "Transaction status updated",
        transaction,
      });
    } else {
      return res.status(400).json({ error: "Failed to verify payment" });
    }
  } catch (error) {
    console.error("paymentStatus error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
