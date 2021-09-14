const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/gallery/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + "-" + file.originalname);
    },
});

const clientStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/client/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + "-" + file.originalname);
    },
});

exports.uploadGallery = multer({ storage: galleryStorage, fileFilter: fileFilter })
exports.uploadClient = multer({ storage: clientStorage, fileFilter: fileFilter })



