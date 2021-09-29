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
    updateStore,
    deleteStore
} = require("../controllers/store");
const {
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.route("/create").post(protect, sellerMiddleware, upload.single("storeImage"), createStore);
router.route("/").get(protect, getAllStore);
router.route("/mystore").get(protect, getOwnStore);
router.route("/update/:storeId").put(protect, sellerMiddleware, upload.single("storeImage"), updateStore);
router.route("/slug/:slug").get(protect, getStoreBySlug);
router.route("/delete/:storeId").delete(protect, sellerMiddleware, deleteStore);
module.exports = router;

