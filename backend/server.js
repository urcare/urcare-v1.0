const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PhonePe Configuration - SANDBOX
const PHONEPE_HOST = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = "M23XRS3XN3QMF";
const SALT_KEY = "713219fb-38d0-468d-8268-8b15955468b0";
const SALT_INDEX = 1;

// Create Payment API
app.post("/api/phonepe/pay", async (req, res) => {
  try {
    const { orderId, amount, userId } = req.body;
    
    console.log("Creating PhonePe payment:", { orderId, amount, userId });

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId || "MUID123",
      amount: amount, // amount in paise (₹100 = 10000)
      redirectUrl: "http://localhost:8080/phonecheckout/result",
      redirectMode: "POST",
      callbackUrl: "http://localhost:5000/api/phonepe/callback",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum = crypto
      .createHash("sha256")
      .update(payloadBase64 + "/pg/v1/pay" + SALT_KEY)
      .digest("hex");
    const finalXVerify = checksum + "###" + SALT_INDEX;

    console.log("PhonePe request payload:", payload);
    console.log("Generated checksum:", finalXVerify);

    const response = await fetch(`${PHONEPE_HOST}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": finalXVerify,
        "accept": "application/json"
      },
      body: JSON.stringify({ request: payloadBase64 })
    });

    const result = await response.json();
    console.log("PhonePe response:", result);

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      res.json({
        success: true,
        redirectUrl: result.data.instrumentResponse.redirectInfo.url,
        orderId: orderId
      });
    } else {
      res.json({
        success: false,
        message: result.message || "Payment failed",
        error: result
      });
    }
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message
    });
  }
});

// PhonePe Callback (after user completes payment)
app.post("/api/phonepe/callback", (req, res) => {
  console.log("📩 PhonePe Callback Data:", req.body);
  // Save transaction status to DB here
  res.status(200).send("Callback received");
});

// Status Check API
app.get("/api/phonepe/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const url = `/pg/v1/status/${MERCHANT_ID}/${orderId}`;
    const checksum = crypto
      .createHash("sha256")
      .update(url + SALT_KEY)
      .digest("hex");
    const finalXVerify = checksum + "###" + SALT_INDEX;

    const response = await fetch(`${PHONEPE_HOST}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": finalXVerify,
        "X-MERCHANT-ID": MERCHANT_ID,
        "accept": "application/json"
      }
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      success: false,
      error: "Status check failed",
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📱 PhonePe integration ready!`);
});
