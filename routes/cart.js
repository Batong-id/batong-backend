const express = require('express')
const router = express.Router()
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { addItemToCart, getCartItems, removeCartItems } = require('../controllers/cart')

router.route('/addToCart').post(protect, addItemToCart);
router.route('/').get(protect, getCartItems)
router.route('/deleteItem/:productId').delete(protect, removeCartItems)


module.exports = router



