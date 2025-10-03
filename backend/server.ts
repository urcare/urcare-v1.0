import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import crypto from "crypto";

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const PORT = process.env.PORT || 5000;
// Use UAT test credentials (official PhonePe sandbox test credentials)
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PHONEPEPGUAT";
const SALT_KEY = process.env.PHONEPE_API_KEY || "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

// ✅ Generate checksum for PhonePe
function generateXVerify(payload: string, apiEndpoint: string): string {
  const stringToHash = payload + apiEndpoint + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return `${sha256}###${SALT_INDEX}`;
}

// ✅ Initiate Payment
app.post("/api/phonepe/pay", async (req, res) => {
  try {
    const { orderId, amount, userId } = req.body;

    console.log("Creating PhonePe payment:", { orderId, amount, userId });

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amount, // amount in paise
      redirectUrl: `${FRONTEND_URL}/phonecheckout/result?transactionId=${orderId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `http://localhost:${PORT}/api/phonepe/callback`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    console.log("PhonePe request payload:", payload);

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const xVerify = generateXVerify(base64Payload, "/pg/v1/pay");

    console.log("Generated X-VERIFY:", xVerify);
    console.log("Calling PhonePe API:", `${PHONEPE_BASE_URL}/pg/v1/pay`);

    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        "accept": "application/json"
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data: any = await response.json();
    console.log("PhonePe response:", data);

    if (data.success && data.data && data.data.instrumentResponse && data.data.instrumentResponse.redirectInfo && data.data.instrumentResponse.redirectInfo.url) {
      return res.json({ 
        success: true, 
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        orderId: orderId
      });
    }

    res.json({ 
      success: false, 
      message: data.message || "Payment initiation failed", 
      error: data 
    });
  } catch (err) {
    console.error("PhonePe Pay Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// ✅ Check Payment Status
app.get("/api/phonepe/status/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const apiEndpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
    const xVerify = generateXVerify("", apiEndpoint);

    console.log("Checking status for:", transactionId);
    console.log("Status endpoint:", `${PHONEPE_BASE_URL}${apiEndpoint}`);

    const response = await fetch(`${PHONEPE_BASE_URL}${apiEndpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        "X-MERCHANT-ID": MERCHANT_ID,
        "accept": "application/json"
      },
    });

    const data = await response.json();
    console.log("Status response:", data);
    res.json(data);
  } catch (err) {
    console.error("PhonePe Status Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// ✅ PhonePe Callback
app.post("/api/phonepe/callback", (req, res) => {
  console.log("📩 PhonePe Callback Data:", req.body);
  res.status(200).send("Callback received");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 PhonePe Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${PHONEPE_BASE_URL.includes('preprod') ? 'SANDBOX' : 'PRODUCTION'}`);
  console.log(`🔑 Merchant ID: ${MERCHANT_ID}`);
});

