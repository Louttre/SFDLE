import { UserModel } from '../models/user.model.js';
import { signUpErrors } from '../utils/errors.utils.js';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import { generateJWTandsetCookie } from '../utils/generateJWTandsetCookie.js';
import { sendVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail, sendResetSuccessEmail } from '../mailtrap/emails.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // create a new user
        const verificationToken = generateVerificationCode();
        const user = await UserModel.create({
            username,
            email,
            password,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 60 * 60 * 24 * 1000 // 24 hours
        });

        // send verification email and set JWT cookie
        generateJWTandsetCookie(res, user._id);
        await sendVerificationEmail(user.email, user.verificationToken);
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = signUpErrors(err)
        res.status(400).json({
            message: 'An error occurred during sign up.',
            error: errors
        });
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Find the user with the matching verification code and check expiration
        const user = await UserModel.findOne({
            verificationToken: code,
            verificationTokenExpireAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(404).json({ message: "Invalid verification code or expired." });
        }
        // Update user's email verification status and clear verification code and expiration
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.username);
        res.status(200).json({
            message: 'Email verified successfully.',
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (err) {
        return res.status(400).json({ message: 'An error occurred during email verification.', error: err });
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate JWT and set cookie
        generateJWTandsetCookie(res, user._id);

        await user.save();

        res.status(200).json({
            message: "Logged in successfully"
            , user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        console.log("Error in login func: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const signOut = async (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('jwt', { path: '/' });
    res.status(200).json({ message: 'Sign out successfully.' });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Find the user with the matching email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Generate a reset token and set it to the user
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpireAt = Date.now() + 60 * 60 * 1000; // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpireAt = resetTokenExpireAt;

        await user.save();

        // Send reset password email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ message: 'Reset password email sent successfully.' });
    } catch (err) {
        console.log("Error in forgotPassword func: ", err);
        res.status(400).json({ message: 'An error occurred during password reset.', error: err });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find the user with the matching reset token and check expiration
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpireAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid token or expired." });
        }

        // Update user's password with the new password
        user.password = password;

        // Clear reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpireAt = undefined;

        // Save the user (password will be hashed by the pre-save hook)
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({
            message: 'Password reset successfully.'
        });
    } catch (err) {
        console.log("Error in resetPassword func: ", err);
        res.status(400).json({ message: 'An error occurred during password reset.', error: err });
    }
}

export const checkAuth = async (req, res) => {
    try {
        // Find the user with the userId from the JWT
        const user = await UserModel.findById(req.userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: "Invalid user" });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.log("Error in checkAuth func: ", err);
        res.status(400).json({ message: 'An error occurred during checkAuth.', error: err });
    }
}