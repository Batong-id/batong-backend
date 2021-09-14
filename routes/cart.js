const express = require('express')
const router = express.Router()
const {
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')
const { upload } = require('../middleware/upload')
const { addItemToCart, getCartItems, removeCartItems } = require('../controllers/cart')

router.route('/addToCart').post(protect, addItemToCart);
router.route('/').get(protect, getCartItems)
router.route('/deleteItem/:productId').delete(protect, removeCartItems)


module.exports = router



