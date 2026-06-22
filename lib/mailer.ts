import nodemailer from "nodemailer";
import path from "path";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html, attachments }: MailOptions) {
  if (!process.env.SMTP_USER) {
    console.warn("⚠️ SMTP credentials not found. Simulating email sending to:", to);
    console.log("SUBJECT:", subject);
    return { messageId: "simulated-id" };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"SellioAI" <noreply@sellioai.com>',
    to,
    subject,
    html,
    attachments,
  });

  return info;
}

function generateDiscountCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SELLIO-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function sendWaitlistEmail(email: string) {
  const code = generateDiscountCode();

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:sellio-logo" alt="SellioAI Logo" style="max-height: 50px; width: auto;" />
      </div>
      <h2 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700;">Welcome to the SellioAI Waitlist!</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
        Thank you for joining our waitlist! We are thrilled to have you on board.
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
        We are working hard to build the ultimate WhatsApp and Instagram automation tool for your social commerce business.
        As promised, because you are an early supporter, you have secured <strong>100% off (free)</strong> on your first plan!
      </p>
      <div style="background-color: #f9fafb; padding: 25px; border-radius: 12px; text-align: center; margin: 35px 0; border: 1px dashed #d1d5db;">
        <span style="font-size: 14px; color: #6b7280; display: block; margin-bottom: 10px;">
          Your Exclusive Free Access Code
        </span>
        <span style="font-size: 32px; font-weight: 800; color: #27AE60; letter-spacing: 3px; font-family: monospace;">
          ${code}
        </span>
        <br/><br/>
        <span style="font-size: 15px; color: #6b7280;">
          Use this code at checkout for 100% off (free) your first plan.
        </span>
      </div>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
        Keep an eye on your inbox. We will notify you as soon as the full release of SellioAI is available!
      </p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 35px 0;" />
      <div style="text-align: center; color: #9ca3af; font-size: 14px;">
        <p style="margin-bottom: 5px;">SellioAI Team</p>
        <a href="https://sellio-ai.com" style="color: #27AE60; text-decoration: none; font-weight: 500;">sellio-ai.com</a>
      </div>
    </div>
  `;

  const logoPath = path.join(process.cwd(), "public", "assets", "logo", "dark.png");

  await sendMail({
    to: email,
    subject: "You're on the SellioAI Waitlist! (100% Off Secured)",
    html,
    attachments: [
      {
        filename: "dark.png",
        path: logoPath,
        cid: "sellio-logo",
      },
    ],
  });
}

export async function sendTesterThankYouEmail(email: string, name?: string) {
  const code = generateDiscountCode();
  const greeting = name ? `<p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hi ${name.replace(/</g, '&lt;')},</p>` : '';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="cid:sellio-logo" alt="SellioAI Logo" style="max-height: 50px; width: auto;" />
      </div>
      <h2 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700;">Thank You for Testing SellioAI! 🎉</h2>
      ${greeting}
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
        Your feedback is incredibly valuable and will directly help us improve our AI sales agent.
        Thank you for taking the time to test it and share your honest experience.
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
        As a thank you for being an early tester, here is your <strong>100% free access code</strong> for SellioAI:
      </p>
      <div style="background-color: #f9fafb; padding: 25px; border-radius: 12px; text-align: center; margin: 35px 0; border: 1px dashed #d1d5db;">
        <span style="font-size: 14px; color: #6b7280; display: block; margin-bottom: 10px;">
          Your Exclusive Free Access Code
        </span>
        <span style="font-size: 32px; font-weight: 800; color: #27AE60; letter-spacing: 3px; font-family: monospace;">
          ${code}
        </span>
        <br/><br/>
        <span style="font-size: 15px; color: #6b7280;">
          Use this code at checkout for 100% off (free) your first plan.
        </span>
      </div>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
        We will keep you updated on improvements and new features. Stay tuned!
      </p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 35px 0;" />
      <div style="text-align: center; color: #9ca3af; font-size: 14px;">
        <p style="margin-bottom: 5px;">SellioAI Team</p>
        <a href="https://sellio-ai.com" style="color: #27AE60; text-decoration: none; font-weight: 500;">sellio-ai.com</a>
      </div>
    </div>
  `;

  const logoPath = path.join(process.cwd(), "public", "assets", "logo", "dark.png");

  await sendMail({
    to: email,
    subject: "Thank You for Testing SellioAI! (Your 100% Free Access Inside)",
    html,
    attachments: [
      {
        filename: "dark.png",
        path: logoPath,
        cid: "sellio-logo",
      },
    ],
  });
}
