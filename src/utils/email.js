import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

export const getWelcomeEmailTemplate = (name) => {
    return `
    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="StoreFleet Logo" style="width: 150px; margin-bottom: 20px;">
        <h1 style="color: #4CAF50;">Welcome to Storefleet</h1>
        <h3>Hello, ${name}</h3>
        <p>Thank you for registering with Storefleet. We're excited to have you as a new member of our community.</p>
        <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get Started</a>
    </div>
    `;
};

export const getResetPasswordTemplate = (url) => {
    return `
    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h1 style="color: #4CAF50;">Reset Your Password</h1>
        <p>You requested a password reset. Click the button below to reset your password.</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #e53e3e; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    </div>
    `;
};

export default sendEmail;
