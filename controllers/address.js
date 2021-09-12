const Address = require('../models/Address')
const UserAddress = require('../models/Address')

exports.addAddress = (req, res) => {
    const { name, mobileNumber, postCode, address, city, province, landmark, alternatePhone, addressType } = req.body;
    if (address) {
        if (address._id) {
            UserAddress.findOneAndUpdate(
                { user: req.user._id, "address._id": address._id },
                {
                    $set: {
                        "address.$": address,
                    },
                }
            ).exec((error, address) => {
                if (error) return res.status(400).json({ error });
                if (address) {
                    res.status(201).json({ address });
                }
            });
        } else {
            UserAddress.findOneAndUpdate(
                { user: req.user._id },
                {
                    $push: {
                        address: { address, name, mobileNumber, postCode, city, province, landmark, alternatePhone, addressType },

                    },
                },
                { new: true, upsert: true }
            ).exec((error, succressAddress) => {
                if (error) {
                    console.log(error)
                    return res.status(400).json({ error })
                };
                if (succressAddress) {
                    res.status(201).json({ succressAddress });
                }
            });
        }
    } else {
        res.status(400).json({ error: "Params address required" });
    }
};

exports.getAddress = (req, res) => {
    UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
        if (error) return res.status(400).json({ error });
        if (userAddress) {
            const user = userAddress.address
            res.status(200).json({ user });
        }
    });
};