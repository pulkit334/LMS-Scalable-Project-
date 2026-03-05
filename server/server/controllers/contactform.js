const Contact = require("../models/contactform")


exports.submitContactForm = async (req, res) => {

  try {
    const { firstName, lastName, email, message, contactNumber } = req.body;

    // 🔴 basic validation
    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "First name, email and message are required",
      });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      message,
      contactNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the form",
    });
  }
};
