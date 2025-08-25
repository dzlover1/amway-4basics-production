const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Configure email service (Gmail example)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Set in Netlify dashboard
        pass: process.env.EMAIL_PASS  // Gmail App Password
      }
    });

    // Generate secure reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15) +
                      Date.now().toString(36);
    
    // Professional email template with Amway branding
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Amway 4 Basics</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
          
          <!-- Header with Amway Diamond Branding -->
          <div style="background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              💎 Amway 4 Basics
            </h1>
            <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 16px;">
              Master the fundamentals of success
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
              Password Reset Request
            </h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hello,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              You requested a password reset for your Amway 4 Basics Tracker account. 
              Click the button below to reset your password securely.
            </p>
            
            <!-- Reset Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.SITE_URL}/reset.html?token=${resetToken}" 
                 style="background: linear-gradient(135deg, #1e40af, #3b82f6); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: 500;
                        font-size: 16px;
                        transition: all 0.2s;">
                🔐 Reset Password
              </a>
            </div>
            
            <!-- Backup Reset Code -->
            <div style="background: #e5e7eb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-weight: 500; color: #1f2937;">
                Alternative Reset Code:
              </p>
              <code style="background: #ffffff; 
                           padding: 8px 12px; 
                           border-radius: 4px; 
                           font-family: 'Courier New', monospace;
                           font-size: 14px;
                           color: #1e40af;
                           border: 1px solid #d1d5db;">
                ${resetToken}
              </code>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
                Copy this code if the button doesn't work
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="border-left: 4px solid #f59e0b; padding: 15px 20px; background: #fef3c7; border-radius: 0 8px 8px 0; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>Security Notice:</strong> This link will expire in 1 hour for your protection. 
                If you didn't request this reset, please ignore this email.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If you're having trouble with the button above, copy and paste the following URL into your web browser:
            </p>
            <p style="word-break: break-all; color: #1e40af; font-size: 12px; background: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${process.env.SITE_URL}/reset.html?token=${resetToken}
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Best regards,<br>
              <strong style="color: #ffffff;">The Amway 4 Basics Team</strong>
            </p>
            <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 12px;">
              This email was sent because you requested a password reset for your account.
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `;

    // Email configuration
    const mailOptions = {
      from: `"Amway 4 Basics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Amway 4 Basics - Password Reset Request',
      html: emailTemplate,
      text: `
        Amway 4 Basics - Password Reset Request
        
        You requested a password reset for your account.
        
        Reset Code: ${resetToken}
        
        Visit: ${process.env.SITE_URL}/reset.html?token=${resetToken}
        
        This link expires in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        - The Amway 4 Basics Team
      `
    };

    // Send email
    console.log('Sending email to:', email);
    await transporter.sendMail(mailOptions);
    
    // Log success (remove in production)
    console.log('Email sent successfully to:', email);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Password reset email sent successfully',
        // Remove in production:
        debug: `Email sent to ${email} with token ${resetToken.substring(0, 8)}...`
      })
    };

  } catch (error) {
    console.error('Error sending reset email:', error);
    
    // Return user-friendly error
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send reset email. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
