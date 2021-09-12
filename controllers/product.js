const Product = require("../models/Product");
const Store = require("../models/Store");
const Category = require("../models/Category");
const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");

exports.createProduct = async (req, res, next) => {
    //res.status(200).json( { file: req.files, body: req.body } );

    let productPictures = [];
    const { name, price, desc, category, quantity, status, } = req.body;

    const categoryId = await Category.findOne({ type: category }).select("_id").exec();


    if (req.files.length > 0) {

        productPictures = req.files.map((file) => {
            return { img: file.path };
        });
    }
    const store = await Store.findOne({ owner: req.user._id });

    const productObj = {
        name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        createdBy: req.user._id,
        price,
        store: store,
        desc,
        category: categoryId,
        quantity,
        status,
        productPictures,
    };


    const product = new Product(productObj);
    product.save((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            store.products.push(product)
            store.save()

            return res.status(201).json({ product });
        }
    });
};

exports.getProductsBySlug = (req, res, next) => {
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
            return next(new ErrorResponse("category couldn't be found", 400))
        });
};

exports.getProducts = async (req, res, next) => {
    const products = await Product.find({})
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name type slug" })
        .exec();
    if (products) return res.status(200).json({ products });
    return next(new ErrorResponse("product couldn't be found", 400))
};



exports.getProductDetailsById = async (req, res, next) => {
    console.log("Get Product By Id")
    const { productId } = req.params
    const product = await Product.find({ "_id": productId })
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name type slug" })
        .exec();
    if (product) return res.status(200).json(product)
    return next(new ErrorResponse("product couldn't be found", 400));

};

exports.getProductsByCategory = async (req, res, next) => {
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
    return next(new ErrorResponse("product couldn't be found", 400))
};

exports.updateProductById = async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findOne({ _id: productId })
    const { name, price, desc, category, quantity, status, } = req.body;

    const categoryId = await Category.findOne({ type: category }).select("_id").exec();

    if (req.file > 0) {
        pictures = req.files.map((file) => {
            return { img: file.location };
        });
    }
    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.desc = desc || product.desc;
        product.category = categoryId || product.category;
        product.quantity = quantity || product.quantity;
        product.status = status || product.status
        // product.isOnSale = isOnSale || product.isOnSale;
        // product.productPictures = pictures || product.productPictures;
        if (name) {
            product.slug = `${slugify(name)}-${shortid.generate()}` || product.slug;
        }


        const updatedProduct = await product.save()
        return res.json({ updatedProduct })
    }
    return next(new ErrorResponse("something wrong, product can't be updated", 400))

}

exports.deleteProductById = async (req, res, next) => {
    const productId = req.params.productId;
    if (productId) {
        const product = await Product.findById(productId).exec()
        console.log(product)

        if (product) {
            console.log("here")
            Product.findByIdAndDelete(productId).exec()
            return res.status(202).json({ success: true, data: "product successfully deleted" })
        } return next(new ErrorResponse(`product with id ${productId} counldn't be found`, 400))

    }
    return next(new ErrorResponse("Parameter is required", 400))
}

