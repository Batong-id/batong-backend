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
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;