const upload_s3 = require("../utills/multer-s3");

router.post(
  "/upload/:group/:id",
  upload_s3.single("thumbnail"),
  csrfProtection,
  ctrl.s3_upload
);
