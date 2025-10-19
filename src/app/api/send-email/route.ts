import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Interface for email request body
interface EmailRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input to prevent injection attacks
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: EmailRequestBody = await request.json();
    const { name, email, subject, message } = body;

    // Input validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    // Check if all required environment variables are set
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !recipientEmail) {
      console.error('Missing SMTP configuration in environment variables');
      return NextResponse.json(
        { error: 'Email service is not properly configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Create nodemailer transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465, // Use SSL for port 465, TLS for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP configuration verification failed:', error);
      return NextResponse.json(
        { error: 'Email service configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    // Email content configuration
    const mailOptions = {
      from: `"Portfolio Contact Form" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: sanitizedEmail,
      subject: `Portfolio Contact: ${sanitizedSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #007aff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="margin: 20px 0;">
            <p style="margin: 8px 0;"><strong style="color: #555;">Name:</strong> ${sanitizedName}</p>
            <p style="margin: 8px 0;"><strong style="color: #555;">Email:</strong> ${sanitizedEmail}</p>
            <p style="margin: 8px 0;"><strong style="color: #555;">Subject:</strong> ${sanitizedSubject}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007aff;">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
          </div>

          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">

          <p style="font-size: 12px; color: #666; margin: 10px 0;">
            This email was sent from the portfolio contact form.
          </p>
          <p style="font-size: 12px; color: #666; margin: 10px 0;">
            Reply directly to this email to respond to ${sanitizedName}.
          </p>
          <p style="font-size: 12px; color: #666; margin: 10px 0;">
            Received at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      text: `
Portfolio Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

---
This email was sent from the portfolio contact form.
Reply directly to this email to respond to ${sanitizedName}.
Received at: ${new Date().toLocaleString()}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log successful email send (without sensitive data)
    console.log(`Email sent successfully from ${sanitizedEmail} at ${new Date().toISOString()}`);

    // Return success response
    return NextResponse.json(
      {
        message: 'Email sent successfully! Thank you for your message. I&apos;ll get back to you soon.',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (without sensitive data)
    console.error('Error sending email:', error);

    // Return error response
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later or contact me directly.' },
      { status: 500 }
    );
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emails.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emails.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emails.' },
    { status: 405 }
  );
}
