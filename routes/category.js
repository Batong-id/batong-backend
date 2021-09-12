const express = require('express')
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const {
    addCategory,
    getCategories,
    updateCategories,
    deleteCategories,
} = require("../controllers/category");
const {
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.route("/create").post(protect, adminMiddleware, upload.single("categoryImage"), addCategory);
router.route("/").get(getCategories);
router.route("/update").post(protect, adminMiddleware, upload.array("categoryImage"), updateCategories);
router.route("/delete").post(protect, adminMiddleware, deleteCategories);

module.exports = router;

