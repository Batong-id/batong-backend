const mongoose = require('mongoose')

const StoreSchema = new mongoose.Schema({
    storeName: {
        type: String,
        require: [true, "Please provide store name"]
    },
    desc: {
        type: String,
        require: false
    },
    address: {
        type: String,
        require: false
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    gallery: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gallery",
        }
    ],
    clients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
        }
    ],
    storeImage: {
        type: String,
        required: true,
        default:
            "https://resource.permatamall.com/api/v1/belanja/product/default-product-image.png",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },

})

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;