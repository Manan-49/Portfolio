const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (adjust the folder as needed)
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint to handle contact form submissions
app.post('/contact', async (req, res) => {
  console.log('Received form data:', req.body);

  const { name, email, subject, message } = req.body;
  
  // Basic validation to ensure all fields are provided
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Configure Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Replace with your email address
      pass: process.env.EMAIL_PASSWORD      // Replace with your App Password (do not use your actual Gmail password)
    }
  });

  // Email options for Admin (you)
  let adminMailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER, // Replace with your email address
    subject: `New Contact Form Submission: ${subject}`,
    text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Email options for Confirmation to Sender
  let confirmationMailOptions = {
    from: process.env.EMAIL_USER, // Replace with your email address
    to: email,
    subject: 'Thank You for Contacting Us!',
    text: `Hi ${name},\n\nThank you for reaching out! We've received your message and will get back to you soon.\n\nYour Message:\n${message}\n\nBest Regards,\nUnimax Studio`
  };

  try {
    // Send email to Admin
    await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent.');

    // Send confirmation email to sender
    await transporter.sendMail(confirmationMailOptions);
    console.log('Confirmation email sent to sender.');

    res.status(200).json({
      success: 'Message sent successfully! You will receive a confirmation email shortly.'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
