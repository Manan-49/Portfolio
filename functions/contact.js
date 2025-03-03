const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }
  
  try {
    const data = JSON.parse(event.body);
    const { name, email, subject, message } = data;
    
    // Basic validation to ensure all fields are provided
    if (!name || !email || !subject || !message) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "All fields are required." }) 
      };
    }

    // Configure Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email options for Admin
    let adminMailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Email options for Confirmation to Sender
    let confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Us!',
      text: `Hi ${name},\n\nThank you for reaching out! We've received your message and will get back to you soon.\n\nYour Message:\n${message}\n\nBest Regards,\nUnimax Studio`
    };

    // Send email to Admin
    await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent.');

    // Send confirmation email to sender
    await transporter.sendMail(confirmationMailOptions);
    console.log('Confirmation email sent to sender.');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: 'Message sent successfully! You will receive a confirmation email shortly.'
      })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message.' })
    };
  }
};