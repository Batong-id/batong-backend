const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});

exports.upload = multer({ storage });


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
    if (req.user.role === "seller") {
        return res.status(400).json({ message: "User access denied" });
    }
    next();
};

exports.sellerMiddleware = (req, res, next) => {

    if (req.user.role === "user") {
        return res.status(400).json({ message: "User access denied" });
    }
    next();
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: "User access denied" });
    }
    next();
};