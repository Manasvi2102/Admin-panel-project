import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create transporter using Gmail service
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Define email options
    const mailOptions = {
        from: `"BookNest Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    console.log(`🚀 Sending email to: ${options.email} | Subject: ${options.subject}`);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Mailer Error for ${options.email}:`, error.message);
        throw error;
    }
};

export default sendEmail;
