const express = require('express')
const router = express.Router()
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const {
    createProduct,
    getProducts,
    getProductDetailsById,
    getProductsBySlug,
    deleteProductById
} = require('../controllers/product')
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')

router.route("/create").post(protect, sellerMiddleware, upload.array("productPicture"), createProduct)
router.route("/products/:slug").get(getProductsBySlug);
router.route("/:productId").get(getProductDetailsById);
router.route("/deleteProductById").delete(protect, adminMiddleware, deleteProductById);
router.route("/").get(protect, adminMiddleware, getProducts);


module.exports = router