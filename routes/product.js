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
    getProductsByCategory,
    deleteProductById
} = require('../controllers/product')
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')

router.route("/create").post(protect, createProduct)
router.route("/slug/:slug").get(getProductsBySlug);
router.route("/category/:categoryParams").get(getProductsByCategory);
router.route("/id/:productId").get(getProductDetailsById);
router.route("/").get(protect, getProducts);
// router.route("/deleteProductById").delete(protect, adminMiddleware, deleteProductById);




module.exports = router