import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail = async (to, subject, text) => {

    try {

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        })

        console.log('Email sent: ', info.messageId);
        return info;
        
    } catch (error) {

        console.log('Error sending email:', error);
        
    }

}
