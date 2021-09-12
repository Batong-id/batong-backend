const express = require('express')
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const {
    addGallery,
    getGallery,
    updateGallery,
    deleteGallery,
} = require("../controllers/gallery");
const {
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.route("/adD").post(protect, addGallery);
router.route("/").get(getGallery);
router.route("/update/:galerryId").post(protect, updateGallery);
router.route("/delete/:galerryId").post(protect, deleteGallery);

module.exports = router;