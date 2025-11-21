import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// AWS SES Configuration
const sesClient = new SESClient({
  region: 'ap-south-1', // Same region as your Cognito
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export class EmailVerificationService {
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';
  private static readonly VERIFICATION_CODE_EXPIRY = 15; // minutes

  static async sendVerificationEmail(email: string): Promise<{ success: boolean; message: string; developmentMode?: boolean }> {
    try {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code temporarily (in production, use Redis or database)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`verification_${email}`, JSON.stringify({
          code: verificationCode,
          timestamp: Date.now(),
          expiry: Date.now() + (this.VERIFICATION_CODE_EXPIRY * 60 * 1000)
        }));
      }

      // Email template
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification - GGLDrive</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4285f4, #34a853); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .verification-code { background: #4285f4; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>GGLDrive</h1>
              <h2>Email Verification</h2>
            </div>
            <div class="content">
              <h3>Welcome to GGLDrive!</h3>
              <p>Thank you for signing up. To complete your registration, please verify your email address using the code below:</p>
              
              <div class="verification-code">${verificationCode}</div>
              
              <p><strong>This code will expire in ${this.VERIFICATION_CODE_EXPIRY} minutes.</strong></p>
              
              <p>If you didn't create an account with GGLDrive, please ignore this email.</p>
              
              <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; 2024 GGLDrive. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailText = `
        GGLDrive Email Verification
        
        Welcome to GGLDrive!
        
        Your verification code is: ${verificationCode}
        
        This code will expire in ${this.VERIFICATION_CODE_EXPIRY} minutes.
        
        If you didn't create an account with GGLDrive, please ignore this email.
        
        Best regards,
        GGLDrive Team
      `;

      // Check if we're in development mode (no AWS credentials)
      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.log('Development Mode - Verification Code:', verificationCode);
        return {
          success: true,
          message: `Development mode: Verification code is ${verificationCode}`,
          developmentMode: true
        };
      }

      // Send email via AWS SES
      const command = new SendEmailCommand({
        Source: this.FROM_EMAIL,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: 'GGLDrive - Email Verification',
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailHtml,
              Charset: 'UTF-8',
            },
            Text: {
              Data: emailText,
              Charset: 'UTF-8',
            },
          },
        },
      });

      await sesClient.send(command);

      return {
        success: true,
        message: 'Verification email sent successfully'
      };

    } catch (error: any) {
      console.error('Error sending verification email:', error);
      return {
        success: false,
        message: error.message || 'Failed to send verification email'
      };
    }
  }

  static async verifyEmail(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      if (typeof window === 'undefined') {
        return { success: false, message: 'Verification can only be done on client side' };
      }

      const storedData = localStorage.getItem(`verification_${email}`);
      if (!storedData) {
        return { success: false, message: 'No verification code found for this email' };
      }

      const { code: storedCode, expiry } = JSON.parse(storedData);
      
      if (Date.now() > expiry) {
        localStorage.removeItem(`verification_${email}`);
        return { success: false, message: 'Verification code has expired' };
      }

      if (code !== storedCode) {
        return { success: false, message: 'Invalid verification code' };
      }

      // Code is valid, remove it from storage
      localStorage.removeItem(`verification_${email}`);

      return { success: true, message: 'Email verified successfully' };

    } catch (error: any) {
      console.error('Error verifying email:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify email'
      };
    }
  }
}
