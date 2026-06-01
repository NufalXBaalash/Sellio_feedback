import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html }: MailOptions) {
  if (!process.env.SMTP_USER) {
    console.warn("⚠️ SMTP credentials not found. Simulating email sending to:", to);
    console.log("SUBJECT:", subject);
    // console.log("HTML:", html);
    return { messageId: "simulated-id" };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"SellioAI" <noreply@sellioai.com>',
    to,
    subject,
    html,
  });

  return info;
}

export async function sendWaitlistEmail(email: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #27AE60; text-align: center;">Welcome to the SellioAI Waitlist!</h2>
      <p style="color: #555;">
        Thank you for joining our waitlist! We are thrilled to have you on board.
      </p>
      <p style="color: #555;">
        We are working hard to build the ultimate WhatsApp and Instagram automation tool for your social commerce business. 
        As promised, because you are an early supporter, you have secured a <strong>50% off discount</strong> on your first plan!
      </p>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #27AE60;">
          50% OFF COUPON
        </span>
        <br/><br/>
        <span style="font-size: 14px; color: #888;">
          Your discount will be automatically applied to your account when we launch.
        </span>
      </div>
      <p style="color: #555;">
        Keep an eye on your inbox. We will notify you as soon as the full release of SellioAI is available!
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #888; font-size: 12px; text-align: center;">
        SellioAI Team<br/>
        <a href="https://sellio-ai.com" style="color: #27AE60; text-decoration: none;">sellio-ai.com</a>
      </p>
    </div>
  `;

  await sendMail({
    to: email,
    subject: "You're on the SellioAI Waitlist! (50% Off Secured)",
    html,
  });
}
