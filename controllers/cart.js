const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");
const User = require('../models/User');
const Cart = require('../models/Cart')


exports.addItemToCart = async (req, res) => {

    Cart.findOne({ user: req.user._id }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
            //if cart already exists then update cart by quantity
            const product = req.body.cartItems.product;
            const item = cart.cartItems.find((c) => c.product == product);
            console.log(item)
            let condition, update;
            if (item) {
                condition = { user: req.user._id, "cartItems.product": product };
                update = {
                    $set: {
                        "cartItems.$": {
                            ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity
                        }
                    },
                };
            } else {
                condition = { user: req.user._id };
                update = {
                    $push: {
                        cartItems: req.body.cartItems,
                    },
                };
            }
            Cart.findOneAndUpdate(condition, update)
                .exec((error, _cart) => {
                    if (error) return res.status(400).json({ error });
                    if (_cart) {
                        return res.status(201).json({ cart: _cart });

                    }
                })

        } else {
            //if cart not exist then create a new cart
            const cart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems,
            });
            cart.save((error, cart) => {
                if (error) return res.status(400).json({ error });
                if (cart) {
                    return res.status(201).json({ cart });
                }
            });
        }
    });
};

exports.getCartItems = (req, res) => {
    //const { user } = req.body.payload;
    //if(user){
    console.log("get cart items")
    Cart.findOne({ user: req.user._id })
        .populate("cartItems.product", "_id name price productPictures")
        .exec((error, cart) => {
            if (error) return res.status(400).json({ error });
            if (cart) {
                let cartItems = {};
                cart.cartItems.forEach((item, index) => {
                    cartItems[item.product._id.toString()] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        price: item.product.price,
                        qty: item.quantity,
                        img: item.product.productPictures[0]
                    };
                });
                res.status(200).json({ cartItems });
            }
        });
};

exports.removeCartItems = (req, res) => {
    console.log("remove Item")
    const productId = req.params.productId
    console.log(productId)
    if (productId) {
        Cart.updateOne(
            { user: req.user._id },
            {
                $pull: {
                    cartItems: {
                        product: productId,
                    },
                },
            }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            }
        });
    }
};