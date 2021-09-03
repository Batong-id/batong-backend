const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify")
const shortid = require("shortid");

exports.createProduct = (req, res) => {
    //res.status(200).json( { file: req.files, body: req.body } );

    const { name, price, desc, category, quantity, createdBy, status } = req.body;
    let productPictures = [];

    if (req.file > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.location };
        });
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        desc,
        productPictures,
        category,
        status,
        createdBy: req.user._id,
    });

    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product, files: req.files });
        }
    });
};

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug })
        .select("_id type")
        .exec((error, category) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (category) {
                Product.find({ category: category._id }).exec((error, products) => {
                    if (error) {
                        return res.status(400).json({ error });
                    }

                    if (category.type) {
                        if (products.length > 0) {
                            res.status(200).json({
                                products,
                                priceRange: {
                                    under50k: 50000,
                                    under100k: 100000,
                                    under200k: 200000,
                                    under300k: 300000,
                                    under500k: 500000,
                                },
                                productsByPrice: {
                                    under50k: products.filter((product) => product.price <= 50000),
                                    under100k: products.filter(
                                        (product) => product.price > 50000 && product.price <= 100000
                                    ),
                                    under200k: products.filter(
                                        (product) => product.price > 100000 && product.price <= 200000
                                    ),
                                    under300k: products.filter(
                                        (product) => product.price > 200000 && product.price <= 300000
                                    ),
                                    under500k: products.filter(
                                        (product) => product.price > 300000 && product.price <= 500000
                                    ),
                                },
                            });
                        }
                    } else {
                        res.status(200).json({ products });
                    }
                });
            }
        });
};

exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if (productId) {
        Product.findOne({ _id: productId }).exec((error, product) => {
            if (error) return res.status(400).json({ error });
            if (product) {
                res.status(200).json({ product });
            }
        });
    } else {
        return res.status(400).json({ error: "Params required" });
    }
};

// new update
exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        Product.deleteOne({ _id: productId }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            }
        });
    } else {
        res.status(400).json({ error: "Params required" });
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find({ createdBy: req.user._id })
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name" })
        .exec();

    res.status(200).json({ products });
};