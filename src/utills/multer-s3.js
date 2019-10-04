const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const uuidv1 = require("uuid/v1");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  fileFilter: function(_, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("허용되지 않는 파일형식"));
    }
    callback(null, true);
  },

  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,

    key: function(req, file, cb) {
      cb(null, "images/" + uuidv1() + "." + file.mimetype.split("/")[1]);
    },
    acl: "public-read"
  })
});

const deleteS3 = url => {
  return s3.deleteObject(
    {
      Bucket: process.env.AWS_BUCKET,
      Key: `images/${url.split("images/")[1]}`
    },
    function(err, data) {}
  );
};

module.exports = { upload, deleteS3 };
