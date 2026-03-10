import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
    if (!transporter) {
        // Optimized for Gmail App Passwords
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async (options) => {
    const transporter = getTransporter();

    const mailOptions = {
        from: `"BookNest Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    console.log(`🚀 Attempting to send email to: ${options.email}`);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent! MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Mailer Error: ${error.message}`);
        throw error;
    }
};

export default sendEmail;
