const express = require("express");
const router = express.Router();
const image = require("../database/images");
const { upload, deleteS3 } = require("../utills/multer-s3");

// 특정 리스트에 이미지 추가
/**
 * @api {post} /images Upload Image
 * @apiName UploadImage
 * @apiGroup Images
 *
 * @apiParam (path) {Number} listId
 * @apiParam {Binary} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "listId": 1,
 *     "file": "aaaaa",
 * }
 * @apiSuccessExample {json} Success 마지막 이미지만 응답:
 * HTTP/1.1 200 OK
 * {
 *     "imageId": 4,
 *     "listId": 1,
 *     "url": "https://nyamnyam.s3.ap-northeast-2.amazonaws."
 * }
 */
router.post("/", upload.array("file"), (req, res, next) => {
  const listId = req.body["listId"];
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

// 리스트의 이미지들 가져오기
/**
 * @api {get} /images/list/:listId Get Images in list
 * @apiName GetListImages
 * @apiGroup Images
 *
 * @apiParam (path) {Number} ListID
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "imageId": 2,
 *     "listId": 1,
 *     "url": "https://nyamnyam.s3.ap-northeast-2.amazonaws."
 * },
 * {
 *     "imageId": 3,
 *     "listId": 1,
 *     "url": "https://nyamnyam.s3.ap-northeast-2.amazonaws."
 * }
 */
router.get("/list/:listId", function(req, res, next) {
  const listId = req.params["listId"];

  image
    .getListImage(listId)
    .then(image => {
      res.status(200).json(image);
    })
    .catch(err => {
      next(err);
    });
});

// 특정 이미지 가져오기
/**
 * @api {get} /images/:ImageId Get the Image
 * @apiName GetImage
 * @apiGroup Images
 *
 * @apiParam (path) {Number} ImageID
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "imageId": 3,
 *     "listId": 1,
 *     "url": "https://nyamnyam.s3.ap-northeast-2.amazonaws."
 * }
 */
router.get("/:ImageId", function(req, res, next) {
  const ImageId = req.params["ImageId"];

  image
    .getImage(ImageId)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

// 이미지 수정
/**
 * @api {put} /imagess/:ImageId Modify Image
 * @apiName ModifyImages
 * @apiGroup Images
 *
 * @apiParam (path) {Number} ImageId
 * @apiParam {Binary} body body.
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "imageId": 4,
 *     "listId": 1,
 *     "url": "https://nyamnyam.s3.ap-northeast-2.amazonaws."
 * }
 */
router.put("/:ImageId", upload.array("file"), function(req, res, next) {
  const ImageId = req.params["ImageId"];
  const urls = req.files.map(file => file.location);

  image
    .modifyImage(ImageId, urls[0])
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

// 이미지 삭제
/**
 * @api {delete} /images/:imageId Delete Image
 * @apiName DeleteImage
 * @apiGroup Images
 *
 * @apiParam (path) {Number} ImageId
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
router.delete("/:ImageId", async function(req, res, next) {
  const ImageId = req.params["ImageId"];

  await image.getImage(ImageId).then(result => {
    deleteS3(result.url);
  });

  image
    .deleteImage(ImageId)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
