import { sendEmailWithRetry } from "@/helper/emailLogic";
import { escapeHtml } from "@/utils/escapeHtml";

export const sendVerificationMail = async (recipient: string, code: string) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Email Verification - LinkOrgNet</h2>
      <p>Hi there,</p>
      <p>Thank you for registering. Please use the verification code below to verify your email:</p>
      <h1 style="color: #010156;">${escapeHtml(code)}</h1>
      <p>This code will expire in 5 minutes.</p>
      <p>Best regards,<br/>The LinkOrgNet Team</p>
    </div>
  `;

  await sendEmailWithRetry(
    recipient,
    "Verify your email address",
    htmlContent
  );
};
