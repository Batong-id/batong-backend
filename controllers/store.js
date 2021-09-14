const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");
const Store = require('../models/Store')
const Product = require('../models/Product')


exports.createStore = async (req, res, next) => {
    const { storeName, desc } = req.body;
    const storeObj = {
        storeName,
        desc,
        slug: `${slugify(storeName)}-${shortid.generate()}`,
        owner: req.user._id,
    }
    const products = await Product.find({ 'store.owner': req.user._id })
        .exec();

    if (products) {
        storeObj.products = products
    }

    if (req.file) {
        storeObj.storeImage = req.file.path;
    }

    console.log(storeObj)
    const store = new Store(storeObj);
    store.save((error, store) => {
        if (error) return next(new ErrorResponse(error, 400));
        if (store) {
            return res.status(201).json({ store });
        }
    });
}

exports.getAllStore = async (req, res, next) => {
    const store = await Store.find({})
        .select("_id storeName slug desc gallery clients products owner storeImage ")
        .populate({ path: "products", select: "_id name price quantity slug description productPictures category" })
        .exec();

    if (store) {
        res.status(200).json({ store })
    }
    else {
        return next(new ErrorResponse("store empty", 403))
    }

}

exports.getOwnStore = async (req, res, next) => {
    const store = await Store.find({ owner: req.user._id })
        .select("_id storeName slug desc products owner storeImage")
        .populate({ path: "products", select: "_id name price quantity slug description productPictures category" })
        .exec();

    if (store) {
        console.log('Store Found')
        res.status(200).json({ store })
    }
    else {
        return next(new ErrorResponse("store not found", 404))
    }

}

exports.getStoreBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    const store = await Store.findOne({ slug: slug })
        .select("_id storeName slug desc products owner storeImage")
        .populate({ path: "products", select: "_id name price quantity slug description productPictures category" })
        .exec();
    if (store) res.status(200).json({ store });
    return next(new ErrorResponse("store not found", 404))
}

exports.updateStore = async (req, res, next) => {
    const storeId = req.params.storeId
    const store = await Store.findById({ _id: storeId })
    const { storeName, desc } = req.body;

    if (store) {
        store.storeName = storeName || store.storeName;
        store.desc = desc || store.desc;
        if (storeName) {
            store.slug = `${slugify(storeName)}-${shortid.generate()}` || store.slug;
        }
        if (req.file) {
            storeObj.storeImage = "/public/" + req.file.path;
        }
        const updatedStore = await store.save()

        return res.json({ store })
    }
    return next(new ErrorResponse("something wrong, store can't be updated", 400))
}

exports.deleteStore = async (req, res, next) => {
    console.log("Delete Store By Id")
    const storeId = req.params.storeId

    if (storeId) {
        const store = await Store.findById(storeId).exec()
        console.log(store)

        if (store) {
            console.log("here")
            Store.findByIdAndDelete(storeId).exec()
            return res.status(202).json({ success: true, data: "Store successfully deleted" })
        } return next(new ErrorResponse(`store with id ${storeId} counldn't be found`, 400))



    }
    return next(new ErrorResponse("params is required", 400))
}