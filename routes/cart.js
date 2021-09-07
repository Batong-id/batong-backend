const express = require('express')
const router = express.Router()
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { addItemToCart } = require('../controllers/cart')

router.route('/addToCart').post(protect, addItemToCart);


module.exports = router



