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
const { uploadGallery } = require('../middleware/upload')

router.route("/add").post(protect, uploadGallery.array("pictures"), addGallery)
router.route("/").get(getGallery);
router.route("/update/:galerryId").post(protect, updateGallery);
router.route("/delete/:galerryId").post(protect, deleteGallery);

module.exports = router;