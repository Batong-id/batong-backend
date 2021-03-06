const express = require('express')
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const {
    addClient,
    getClient,
    updateClient,
    deleteClient,
} = require("../controllers/client");
const {
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { uploadClient } = require('../middleware/upload')

router.route("/add").post(protect, uploadClient.array("clientPictures"), addClient)
router.route("/").get(protect, getClient);
router.route("/update/:clientId").post(protect, updateClient);
router.route("/delete/:clientId").post(protect, deleteClient);

module.exports = router;