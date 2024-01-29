const nodemailer = require('nodemailer');

/**
 * Sends an email using nodemailer.
 * @param {Object} options - The email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.message - The plain text email message.
 * @param {string} options.html - The HTML email message.
 * @throws {Error} If there is an error sending the email.
 */
const sendEmail = async (options) => {
    try {
        // Create a nodemailer transporter with the provided email configuration
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: process.env.MAIL_SECURE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Set the email options
        const mailOptions = {
            from: `"Nodejs Auth" <${process.env.MAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        // Send the email using the transporter and mail options
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
};

module.exports = sendEmail;
