const Client = require("../models/Client");
const Store = require("../models/Store");
const slugify = require("slugify");
const shortid = require("shortid");
const ErrorResponse = require("../utils/errorResponse");

exports.addClient = async (req, res, next) => {
    let clientPictures = []
    const { clientName, orderName, quantity, price, totalPrice } = req.body;

    if (req.files.length > 0) {
        clientPictures = req.files.map((file) => {
            return { img: file.path };
        });
    }
    const store = await Store.findOne({ owner: req.user._id });
    if (store) {
        const clientObj = {
            clientName,
            slug: `${slugify(req.body.clientName)}-${shortid.generate()}`,
            orderName,
            quantity,
            price,
            totalPrice,
            clientPictures,
            store: store,
        }

        const client = new Client(clientObj);
        client.save((error, client) => {
            if (error) return res.status(400).json({ error });
            if (client) {
                store.clients.push(client._id)
                store.save()
                return res.status(201).json({ client });
            }
        })
    } else {
        return next(new ErrorResponse("store not found", 404));
    }


}

exports.getClient = async (req, res, next) => {
    const store = await Store.findOne({ owner: req.user._id });

    const clients = await Client.find({ store: store })
        .select("_id clientName orderName slug quantity price totalPrice clientsPictures store")
        .populate({ path: "store", select: "_id storeName desc owner" })
        .exec();
    if (clients) return res.status(200).json({ clients });
    return next(new ErrorResponse("client couldn't be found", 400))
}

// exports.getAllClientPict = async (req, res, next) => {
//     const clients = await Client.find({ store: store })
//         .select("clientsPictures")
//         .populate({ path: "store", select: "_id storeName desc owner" })
//         .exec();
// }

exports.updateClient = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}

exports.deleteClient = async (req, res, next) => {
    res.status(200).json({ body: req.body });
}