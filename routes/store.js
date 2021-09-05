const express = require('express')
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const {
    createStore,
    getAllStore,
    getOwnStore,
    getStoreBySlug,
    updateStore
} = require("../controllers/store");
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')

router.route("/create").post(protect, adminMiddleware, upload.single("categoryImage"), createStore);
router.route("/").get(protect, getAllStore);
router.route("/mystore").get(protect, getOwnStore);
router.route("/update/:storeId").put(protect, updateStore);
router.route("/slug/:slug").get(protect, getStoreBySlug);
router.route("/slug/:slug").put(protect, getStoreBySlug);
module.exports = router;

