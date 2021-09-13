const Gallery = require("../models/Gallery");
const Store = require("../models/Store");
const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");

exports.addGallery = async (req, res, next) => {
    // res.status(200).json({ body: req.body, file: req.files });
    let pictures = []
    const { title, desc } = req.body;

    if (req.files.length > 0) {
        pictures = req.files.map((file) => {
            return { img: file.path };
        });
    }
    const store = await Store.findOne({ owner: req.user._id }).exec();

    if (store) {
        const galleryObj = {
            title,
            slug: `${slugify(req.body.title)}-${shortid.generate()}`,
            desc,
            pictures,
            store: store,
        }

        const gallery = new Gallery(galleryObj);
        gallery.save((error, gallery) => {
            if (error) return res.status(400).json({ error });
            if (gallery) {
                store.gallery.push(gallery._id)
                store.save()
                return res.status(201).json({ gallery });
            }
        })
    } else {
        return next(new ErrorResponse("store not found", 404));
    }

}

exports.getGallery = async (req, res, next) => {
    const gallery = await Gallery.find({})
        .select("_id title desc slug pictures store")
        .populate({ path: "store", select: "_id storeName desc owner" })
        .exec();
    if (gallery) return res.status(200).json({ gallery });
    return next(new ErrorResponse("gallery couldn't be found", 400))
}

exports.updateGallery = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.deleteGallery = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}