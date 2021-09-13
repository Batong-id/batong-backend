const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    orderName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    clientPictures: [
        {
            img: {
                type: String,
                required: true,
                default:
                    "https://resource.permatamall.com/api/v1/belanja/product/default-product-image.png",
            }
        }
    ],
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
    }
});

const Client = mongoose.model("Client", ClientSchema);
module.exports = Client;