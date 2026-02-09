// const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.sendStripeKey = (req, res) => {
//   res.send({ stripeApiKey: process.env.STRIPE_API_KEY });
// };

// exports.processPayment = async (req, res) => {
//   const { amount } = req.body;

//   const paymentIntent = await Stripe.paymentIntents.create({
//     amount: amount * 100,
//     currency: "npr",
//     payment_method_types: ["card"],
//   });

//   if (!paymentIntent) {
//     return res.status(400).json({ error: "Something went wrong" });
//   }

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// };

const crypto = require("crypto");
const axios = require("axios");
const xml2js = require("xml2js");

function generateSignature(fields, secretKey, signedFieldNames) {
  const dataString = signedFieldNames
    .map((key) => `${key}=${fields[key]}`)
    .join(",");

  return crypto
    .createHmac("sha256", secretKey)
    .update(dataString)
    .digest("base64");
}

exports.createPayment = (req, res) => {
  const { total_amount, tax_amount = "0", transaction_uuid } = req.body;

  if (!total_amount || !transaction_uuid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const product_code = process.env.ESEWA_MERCHANT_CODE;
  const secretKey = process.env.ESEWA_SECRET_KEY;

  const signedFieldNames = ["total_amount", "transaction_uuid", "product_code"];

  const fieldsToSign = {
    total_amount,
    transaction_uuid,
    product_code,
  };

  const signature = generateSignature(
    fieldsToSign,
    secretKey,
    signedFieldNames
  );

  res.json({
    amount: total_amount,
    tax_amount,
    total_amount,
    transaction_uuid,
    product_code,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: `${process.env.CLIENT_URL}/orderSuccess?transaction_uuid=${transaction_uuid}&amount=${total_amount}`,
    failure_url: `${process.env.CLIENT_URL}/payment-failure`,
    signed_field_names: signedFieldNames.join(","),
    signature,
  });
};

exports.verifyPayment = async (req, res) => {
  const { transaction_uuid, amount } = req.query;

  if (!transaction_uuid || !amount) {
    return res.status(400).json({ success: false, message: "Missing params" });
  }

  try {
    const url = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=${amount}&transaction_uuid=${transaction_uuid}`;

    console.log("Calling eSewa verify:", url);

    const { data } = await axios.get(url);

    if (data.status === "COMPLETE") {
      return res.json({
        success: true,
        message: "Payment verified",
        ref_id: data.ref_id,
      });
    } else {
      return res.json({
        success: false,
        message: `Paymeent ${data.status}`,
        details: data,
      });
    }
  } catch (error) {
    console.error("Verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal error during verification",
      error: error.message,
    });
  }
};
