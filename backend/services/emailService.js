import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendStaffCredentials = async (email, name, plainPassword) => {
    try {
        await transporter.sendMail({
            from: `"CMS Admin" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your Staff Account Credentials',
            text: `Hello ${name},\n\nA staff account has been created for you.\n\nEmail: ${email}\nPassword: ${plainPassword}\n\nPlease login and change your password immediately.`,
            html: `<p>Hello ${name},</p><p>A staff account has been created for you.</p><ul><li><b>Email:</b> ${email}</li><li><b>Password:</b> ${plainPassword}</li></ul><p>Please login and change your password immediately.</p>`
        });
    } catch (err) {
        console.error('Failed to send email:', err);
    }
};
