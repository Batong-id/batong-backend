const Gallery = require("../models/Gallery");
const Store = require("../models/Store");
const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");

exports.addGallery = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.getGallery = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.updateGallery = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.deleteGallery = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}