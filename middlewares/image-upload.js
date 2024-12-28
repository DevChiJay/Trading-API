const multer = require("multer");
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination: "user-data/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

const userImageUpload = upload.single("image");

module.exports = userImageUpload;
