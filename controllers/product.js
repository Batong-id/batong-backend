const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify")
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");

exports.createProduct = async (req, res) => {
    //res.status(200).json( { file: req.files, body: req.body } );

    let pictures = [];
    const { name, price, desc, category, quantity, status, } = req.body;

    const categoryId = await Category.findOne({ type: category }).select("_id").exec();

    if (req.file > 0) {
        pictures = req.files.map((file) => {
            return { img: file.location };
        });
    }
    const productObj = {
        name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        createdBy: req.user._id,
        price,
        desc,
        category: categoryId,
        quantity,
        status,
        productPictures: pictures,
    };

    const product = new Product(productObj);
    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            return res.status(201).json({ product });
        }
    });
};

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    console.log("getProductBySlug")
    Category.findOne({ slug: slug })
        .select("_id type")
        .exec((category) => {
            if (category) {
                Product.find({ category: category._id }).exec((products) => {
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
                        return res.status(200).json({ products });
                    }
                });
            }
            return new ErrorResponse("category couldn't be found", 400)
        });
};

exports.getProducts = async (req, res) => {
    const products = await Product.find({})
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name type slug" })
        .exec();
    if (products) return res.status(200).json({ products });
    return new ErrorResponse("product couldn't be found", 400)
};



exports.getProductDetailsById = async (req, res) => {
    console.log("Get Product By Id")
    const { productId } = req.params
    const product = await Product.find({ "_id": productId })
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name type slug" })
        .exec();
    if (product) return res.status(200).json(product)
    return new ErrorResponse("product couldn't be found", 400)

};

exports.getProductsByCategory = async (req, res) => {
    console.log("Get Product By Category")
    const { categoryParams } = req.params;
    console.log(categoryParams)

    const categoryId = await Category.findOne({ type: categoryParams }).select("_id").exec();
    console.log(categoryId)

    const product = await Product.find({ category: categoryId })
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name type slug" })
        .exec();
    if (product) return res.status(200).json(product)
    return new ErrorResponse("product couldn't be found", 400)

    // new update
    exports.deleteProductById = (req, res) => {
        const { productId } = req.body.payload;
        if (productId) {
            Product.deleteOne({ _id: productId }).exec((result) => {
                if (result) return res.status(202).json({ result });
                else return new ErrorResponse("product couldn't be found", 400)

            });
        }
        return new ErrorResponse("params is required", 400)

    };
};

