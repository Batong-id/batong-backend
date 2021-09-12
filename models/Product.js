const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name for your product"]
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    status: {
        type: String,
        enum: ['Ready Stock', 'Pre-Order'],
        required: [true, "Please provide your product's status"]
    },
    productPictures: [
        {
            img: {
                type: String,
                required: true,
                default:
                    "https://resource.permatamall.com/api/v1/belanja/product/default-product-image.png",
            }
        }
    ],
    price: {
        type: Number,
        required: [true, "Please add a price to your product"]
    },
    desc: {
        type: String,
        required: [true, "Please add a product description"]
    },
    quantity: {
        type: Number,
        required: [true, "Please provide a product's stock"]
    },
    productSold: {
        type: Number,
        required: false,
        default: 0
    },
    impression: {
        typr: Number,
        required: false,
        default: 0
    },
    isOnSale: {
        type: Boolean,
        required: true,
        default: true
    },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            review: String
        }
    ],

});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;