const Client = require("../models/Client");
const Store = require("../models/Store");
const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");

exports.addClient = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.getClient = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.updateClient = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.deleteClient = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}