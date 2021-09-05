const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");
const Store = require('../models/Store')
const Product = require('../models/Product')

exports.createStore = async (req, res) => {
    const { storeName, desc } = req.body;
    const storeObj = {
        storeName,
        desc,
        slug: `${slugify(storeName)}-${shortid.generate()}`,
        owner: req.user._id,
    }
    const products = await Product.find({ createdBy: req.user._id })
        .exec();



    if (products) {
        storeObj.products = products
    }

    if (req.file) {
        storeObj.storeImage = "/public/" + req.file.filename;
    }

    console.log(storeObj)
    const store = new Store(storeObj);
    store.save((error, store) => {
        if (error) return res.status(400).json({ error });
        if (store) {
            return res.status(201).json({ store });
        }
    });
}

exports.getAllStore = async (req, res) => {
    const store = await Store.find({})
        .select("_id storeName slug desc products owner storeImage")
        .populate({ path: "products", select: "_id name price quantity slug description productPictures category" })
        .exec();

    if (store) res.status(200).json({ store });
    return next(new ErrorResponse("user denied"))
}

exports.getOwnStore = async (req, res) => {
    const store = await Store.find({ owner: req.user._id })
        .select("_id storeName slug desc products owner storeImage")
        .populate({ path: "products", select: "_id name price quantity slug description productPictures category" })
        .exec();
}