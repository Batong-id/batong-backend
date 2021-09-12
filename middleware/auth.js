const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");




exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];

    }
    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse("No user found with this id", 404));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this router", 401));
    }
};

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== "user")
        return next(new ErrorResponse("User access denied", 401))
    next();
};

exports.sellerMiddleware = (req, res, next) => {
    if (req.user.role !== "seller")
        return next(new ErrorResponse("User access denied", 401));
    next();
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin")
        return next(new ErrorResponse("User access denied", 401));
    next();

};