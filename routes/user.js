// const upload = require("../middleware/uploadImage");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// router.post("/upload", upload.single("file"), async (req, res) => {
//     if (req.file === undefined) return res.send("you must select a file.");
//     const imgUrl = `http://localhost:5000/api/v1/editProfile/${req.file.filename}`;
//     return res.send(imgUrl);
// });

const { getUser, updateUser } = require('../controllers/user')
router.route('/').put(protect, updateUser)
router.route('/').get(protect, getUser)


module.exports = router;