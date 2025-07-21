/* eslint-disable */
import axios from 'axios';
import { getAccessToken } from '@/utils/oauth';
 


export const sendEmailWithRetry = async (
  recipient: string,
  subject: string,
  htmlContent: string,
  retries: number = 3
): Promise<void> => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const accessToken = await getAccessToken();

      const emailData = {
        message: {
          subject,
          body: {
            contentType: 'HTML',
            content: htmlContent,
          },
          toRecipients: [
            {
              emailAddress: { address: recipient },
            },
          ],
        },
        saveToSentItems: false,
      };

      await axios.post(
        `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USERNAME}/sendMail`,
        emailData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Email sent successfully');
      return;

    } catch (error: any) {
      attempt++;
      console.error(`Attempt ${attempt}: Failed to send email - ${error.message}`);

      if (attempt >= retries) {
        console.error(`Final error:`, error?.response?.data || error.message);
        throw new Error('Failed to send email after multiple attempts');
      }

      console.log(`🔁 Retrying email... (Attempt ${attempt + 1})`);
    }
  }
};
