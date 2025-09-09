require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const TWO_FACTOR_API_KEY =
  process.env.TWO_FACTOR_API_KEY || "92d2450a-6d09-11f0-a562-0200cd936042";

const otpSessions = {};


app.post("/send-otp", async (req, res) => {
  const { action, phone, otp } = req.body;

  if (!action || !phone) {
    return res.status(400).json({ error: "action and phone are required" });
  }

  if (action === "send") {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${phone}/AUTOGEN`
      );

      if (response.data.Status === "Success") {
        otpSessions[phone] = response.data.Details;
        return res.json({ success: true, message: "OTP sent successfully" });
      } else {
        return res.status(500).json({ error: "Failed to send OTP" });
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      return res.status(500).json({ error: "Error sending OTP" });
    }
  } else if (action === "verify") {
    if (!otp) {
      return res.status(400).json({ error: "OTP is required for verification" });
    }
    if (!otpSessions[phone]) {
      return res.status(400).json({ error: "No OTP session found for this phone" });
    }

    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${otpSessions[phone]}/${otp}`
      );

      if (response.data.Status === "Success") {
        delete otpSessions[phone];
        return res.json({ success: true, message: "OTP verified" });
      } else {
        return res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      return res.status(500).json({ error: "Error verifying OTP" });
    }
  } else {
    return res.status(400).json({ error: "Invalid action. Use 'send' or 'verify'" });
  }
});

// ================= SERVE FRONTEND =================



// ================= START SERVER =================
const PORT = process.env.PORT || 5001; // Use Render's port
app.listen(PORT, () => console.log(`OTP service running on port ${PORT}`));
