import { sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export const sendVerificationEmail = async (email, verificationToken) => {
    // user email
    const recipient = [email];

    // Create a transport
    const transport = Nodemailer.createTransport(
        MailtrapTransport({
            token: process.env.MAILTRAP_TOKEN,
        })
    );
    try {
        // Send Verification Email
        transport.sendMail({
            from: sender,
            to: recipient,
            subject: "SFDLE Account Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Verification Email"
        })
        console.log("Verification email sent successfully");
    } catch (error) {
        console.log(`Error sending verification email: ${error}`);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, pseudo) => {
    // User email
    const recipient = [email];

    try {
        // Create a transport
        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: process.env.MAILTRAP_TOKEN,
            })
        );
        // Send Welcome Email
        transport
            .sendMail({
                from: sender,
                to: recipient,
                templateUuid: "dfbbbd3f-1022-4e0f-95da-8e046e2804f3",
                templateVariables: {
                    "name": pseudo,
                    "company_info_name": "SFDLE",
                    "company_info_city": "Toulouse",
                    "company_info_zip_code": "31000",
                    "company_info_country": "France"
                }
            })
        console.log("Welcome email sent successfully");
    } catch (error) {
        console.log(`Error sending welcome email: ${error}`);
        throw new Error(`Error sending welcome email: ${error}`);
    }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
    //user email
    const recipient = [email];

    try {
        // Create a transport
        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: process.env.MAILTRAP_TOKEN,
            })
        );
        // Send Reset Password Email
        transport
            .sendMail({
                from: sender,
                to: recipient,
                subject: "SFDLE Password Reset",
                html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
                category: "Reset Password Email"
            })
        console.log("Reset password email sent successfully");
    } catch (error) {
        console.log(`Error sending reset password email: ${error}`);
        throw new Error(`Error sending reset password email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    // User email
    const recipient = [email];

    try {
        // Create a transport
        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: process.env.MAILTRAP_TOKEN,
            })
        );
        // Send Reset Password Success email
        transport
            .sendMail({
                from: sender,
                to: recipient,
                subject: "SFDLE Password Reset",
                html: PASSWORD_RESET_SUCCESS_TEMPLATE,
                category: "Reset Password Email"
            })
        console.log("Password reset success email sent successfully");
    } catch (error) {
        console.log(`Error sending password reset success email: ${error}`);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
}