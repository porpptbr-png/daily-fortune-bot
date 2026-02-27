import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatId = process.env.CHAT_ID;

// ===== ข้อมูลส่วนตัว =====
const profile = {
  name: "จีรเดช พุทธเกษร",
  birthDate: "23 June 1992",
  birthDay: "วันอังคาร",
  birthTime: "16:04",
};

// ===== ฟังก์ชันสร้างดวง =====
async function sendDailyFortune() {
  try {
    const today = new Date().toLocaleDateString("th-TH");

    console.log("กำลังวิเคราะห์ดวงของคุณ...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "คุณคือหมอดูมืออาชีพ วิเคราะห์ดวงแบบจริงจัง ลึก แต่กระชับ",
        },
        {
          role: "user",
          content: `
วันนี้วันที่ ${today}

ช่วยวิเคราะห์ดวงเฉพาะบุคคลจากข้อมูลต่อไปนี้:

ชื่อ-นามสกุล: ${profile.name}
วันเกิด: ${profile.birthDay} ${profile.birthDate}
เวลาเกิด: ${profile.birthTime} นาฬิกา

วิเคราะห์ตามหลักโหราศาสตร์ไทยและพลังวันเกิด
แสดงผลลัพธ์เป็นหัวข้อ:

🔹 การงาน
🔹 การเงิน
🔹 ความรัก
🔹 สุขภาพ
🔹 สีมงคลวันนี้
🔹 เลขนำโชค 3 ตัว

ตอบแบบกระชับ อ่านง่าย ไม่ยาวเกินไป
          `,
        },
      ],
    });

    const message = completion.choices[0].message.content;

    await bot.sendMessage(
      chatId,
      `🌅 ดวงประจำวันของคุณ ${profile.name}\n\n${message}`
    );

    console.log("ส่งสำเร็จ ✅");
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
  }
}

// ===== ตั้งเวลา 7:00 ทุกวัน =====
cron.schedule("0 0 * * *", () => {
  sendDailyFortune();
});

console.log("Bot ทำงานอยู่ รอเวลา 07:00 น.");
