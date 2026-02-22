import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const testEmail = async () => {
    console.log('--- Email Configuration Test ---');
    console.log('User:', process.env.EMAIL_USER);
    // password hidden

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('Validating connection...');
        await transporter.verify();
        console.log('✅ Connection successful!');

        const mailOptions = {
            from: `"BookNest Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // send to self
            subject: 'BookNest Configuration Test',
            text: 'If you are reading this, your email configuration is working correctly.',
        };

        console.log('Sending test email to self...');
        await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.code === 'EAUTH') {
            console.log('Possible cause: Invalid credentials or App Password not enabled.');
        }
    }
};

testEmail();
