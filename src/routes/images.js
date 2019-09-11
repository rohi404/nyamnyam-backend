const express = require("express");
const router = express.Router();
const image = require("../database/images");
const upload = require("../utills/multer-s3");

//  이미지 추가
//form name "file" 이여야 함
/**
 * @api {post} /images/:listId Upload Image
 * @apiName UploadImage
 * @apiGroup Images
 *
 * @apiParam (path) {Number} listId
 * @apiParam {Binary} body body.
 * @apiParamExample {Binary} file contents
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "imageId": 4,
 *     "listId": 1,
 *     "url": "https://nyamnyam.s3.ap-northeast-2.amazonaws."
 * }
 */
router.post("/:listId", upload.array("file"), (req, res) => {
  const listId = req.params["listId"];
  const urls = req.files.map(file => file.location);

  image
    .createImage(listId, urls)
    .then(image => {
      res.status(200).json(image);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
