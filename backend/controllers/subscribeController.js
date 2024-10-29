 import subscribeModel from "../models/subscribeModel.js";
import nodemailer from "nodemailer";
import { transporter } from "../config/transporter.js";

// const subscribe = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const existingSubscriber = await subscribeModel.findOne({ email });
//     if (existingSubscriber) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already subscribed." });
//     }

//     const newSubscriber = new subscribeModel({ email });
//     await newSubscriber.save();

//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Welcome to Our Service',
//         text: 'Thank you for subscribing! We are excited to have you on board.',
//       });

//     res
//       .status(201)
//       .json({ success: true, message: "Thank you for joining our community!" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error." });
//   }
// };


const subscribe = async (req, res) => {
    const { email } = req.body;
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format."
      });
    }
  
    try {
      const existingSubscriber = await subscribeModel.findOne({ email });
      if (existingSubscriber) {
        return res.status(400).json({
          success: false,
          message: "Email already subscribed."
        });
      }
  
      const newSubscriber = new subscribeModel({ email });
      await newSubscriber.save();
  
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to Our Service',
          text: 'Thank you for subscribing! We are excited to have you on board.',
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Optionally, you might want to delete the subscriber if email fails
     await subscribeModel.deleteOne({ email });
        return res.status(500).json({
           success: false,
           message: "Subscription failed due to email sending error."
         });
      }
  
      return res.status(201).json({
        success: true,
        message: "Thank you for joining our community!"
      });
    } catch (error) {
      console.error('Subscription error:', error);
      return res.status(500).json({
        success: false,
        message: "Server error."
      });
    }
  };

// New function to get all subscribers
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await subscribeModel.find({});
    res
      .status(200)
      .json({
        emails: subscribers.map((sub) => ({
          email: sub.email,
          date: sub.createdAt,
        })),
      });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Delete Subscriber Function
const deleteSubscriber = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscriber = await subscribeModel.findOne({ email });

    if (!existingSubscriber) {
      return res.status(404).json({ message: "Subscriber not found." });
    }

    await subscribeModel.deleteOne({ email });

    res.status(200).json({ message: "Subscriber deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// API for sending mail
// Send Mail Function with Enhanced Error Handling and Template Validation
const sendMail = async (req, res) => {
  try {
    const { subject, template } = req.body;

    // Basic validation
    if (!template) {
      return res
        .status(400)
        .json({ success: false, message: "Email template is required." });
    }

    // Fetch all subscribers
    const subscribers = await subscribeModel.find({});

    if (!subscribers.length) {
      return res
        .status(400)
        .json({ success: false, message: "No subscribers found" });
    }

    // Define email templates
    const templates = {
      welcome: {
        subject: "Welcome to Our Newsletter!",
        html: `
                    <h1>Welcome to Our Newsletter!</h1>
                    <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
                    <p>Here's what you can expect:</p>
                    <ul>
                        <li>Weekly updates</li>
                        <li>Exclusive content</li>
                        <li>Special offers</li>
                    </ul>
                    <p>Stay tuned for our next update!</p>
                `,
      },
      // Add more templates as needed
    };

    const selectedTemplate = templates[template];

    // Validate selected template
    if (!selectedTemplate) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email template specified." });
    }

    // Optional: Customize template with subscriber data (e.g., using Handlebars)

    // Send emails
    const emailPromises = subscribers.map((subscriber) =>
      transporter.sendMail({
        from: "Paragon Hub",
        to: subscriber.email,
        subject: subject || selectedTemplate.subject,
        html: selectedTemplate.html,
      })
    );

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Emails sent successfully to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error("Bulk email error:", error.message);
    console.error(error.stack);
    res
      .status(500)
      .json({ success: false, message: "Failed to send bulk emails" });
  }
};

const sendWelcome = async (req, res) => {
    const { email } = req.body;
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Service',
        text: 'Thank you for subscribing! We are excited to have you on board.',
      });
  
      res.status(200).json({ success: true, message: "Mail!" });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending welcome email.');
    }
  };

export { subscribe, getSubscribers, sendMail, deleteSubscriber, sendWelcome };
