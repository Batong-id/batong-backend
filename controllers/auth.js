const crypto = require('crypto')
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse")
const sendEmail = require('../utils/sendEmail')

// @desc Registers User
exports.register = async (req, res, next) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password,
        role
    } = req.body;
    try {
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password,
            role
        });
        sendToken(user, 201, res)
    } catch (error) {
        next(error);
    }
};

// @desc Login User
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        };

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials", 401));
        };

        sendToken(user, 200, res)
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    };
};

// @desc    Forgot Password Initialization
exports.forgotPassword = async (req, res, next) => {

    // Send Email to email provided but first check if user exists
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse("No email could not be sent", 404));
        }

        // Reset Token Gen and add to database hashed (private) version of token
        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create reset url to email to provided email
        const resetUrl = `${process.env.FE_URL}/passwordreset/${resetToken}`;


        // HTML Message
        const message = `
        <h1>You have requested a password reset</h1>
        <p>Please make a put request to the following link:</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (error) {
            console.log(error);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Reset user Password
exports.resetPassword = async (req, res, next) => {
    // Compare token in URL params to hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Updated Success",
            token: user.getSignedToken(),
        });
    } catch (error) {
        next(error);
    }
};


const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token })
}