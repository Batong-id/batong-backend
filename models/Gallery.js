const mongoose = require('mongoose')

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    pictures: [
        {
            img: {
                type: String,
                required: true,
                default:
                    "https://resource.permatamall.com/api/v1/belanja/product/default-product-image.png",
            }
        }
    ]
});

const Gallery = mongoose.model("Gallery", GallerySchema);
module.exports = Gallery;