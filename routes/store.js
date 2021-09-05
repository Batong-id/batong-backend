const express = require('express')
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const {
    createStore
} = require("../controllers/store");
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')

router.route("/create").post(protect, adminMiddleware, upload.single("categoryImage"), createStore);
module.exports = router;

