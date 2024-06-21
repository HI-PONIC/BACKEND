const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const PasswordReset = require('../models/passwordResetModel');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate a 6-character verification code
        const expires = Date.now() + 3600000; // 1 hour from now

        await PasswordReset.create(user.id, code, expires);

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Verification Code',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please use the following verification code to reset your password:\n\n
            ${code}\n\n
            This code will expire in 1 hour.\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ error: false, message: 'Verification code sent' });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { code, newPassword } = req.body;

    try {
        const resetRecord = await PasswordReset.findByCode(code);
        if (!resetRecord || resetRecord.expires < Date.now()) {
            return res.status(400).json({ error: true, message: 'Verification code is invalid or has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(resetRecord.user_id, hashedPassword);
        await PasswordReset.delete(resetRecord.id);

        res.status(200).json({ error: false, message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};
