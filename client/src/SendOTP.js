import React, { useState } from "react";
import axios from "axios";

function SendOTP() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // API base URL (from environment variable or fallback to localhost for dev)
  const API_URL = process.env.REACT_APP_API_URL || "https://otp-service-2factor-qdpu.onrender.com";

  const handleSendOtp = async () => {
    if (!phone) {
      setMessage("Please enter phone number");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/send-otp`, {
        action: "send",
        phone,
      });
      setMessage(res.data.message);
      setStep("verify");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/send-otp`, {
        action: "verify",
        phone,
        otp,
      });
      setMessage(res.data.message);
      setStep("send");
      setPhone("");
      setOtp("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>OTP Verification</h2>
      {step === "send" ? (
        <>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={handleSendOtp}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default SendOTP;
