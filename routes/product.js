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
    deleteProductById,
    updateProductById
} = require('../controllers/product')
const {
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.route("/create").post(protect, sellerMiddleware, upload.array("productPictures"), createProduct)
router.route("/slug/:slug").get(getProductsBySlug);
router.route("/category/:categoryParams").get(getProductsByCategory);
router.route("/id/:productId").get(getProductDetailsById);
router.route("/").get(protect, getProducts);
router.route("/delete/:productId").delete(protect, sellerMiddleware, deleteProductById);
router.route("/update/:productId").put(protect, sellerMiddleware, updateProductById)




module.exports = router