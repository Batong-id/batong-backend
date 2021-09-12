const express = require('express')
const router = express.Router()
const {
    upload,
    protect,
    userMiddleware,
    sellerMiddleware,
    adminMiddleware
} = require('../middleware/auth')

const { addAddress, getAddress } = require('../controllers/address')

router.route('/').get(protect, getAddress)
router.route('/add').post(protect, addAddress)


module.exports = router



