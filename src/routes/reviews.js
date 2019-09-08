const express = require('express');
const router = express.Router();
const review = require('../database/reviews')
const moment = require('moment');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

/**
 * @api {post} /reviews Create Review
 * @apiName CreateReview
 * @apiGroup Review
 *
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "user_id": 1,
 *     "list_id": 1,
 *     "content": "hello",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "Id": 1
 *     "user_id": 1,
 *     "list_id": 1,
 *     "content": "hello",
 *     "image": "image1"
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.post('/', function(req, res, next) {
  const userId = req.body["user_id"];
  const listId = req.body["list_id"];
  const content = req.body["content"];

  review.createReview(userId, listId, content)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

/**
 * @api {get} /reviews/reviewinfo/:reviewId Get Review
 * @apiName GetReview
 * @apiGroup Review
 *
 * @apiParam (path) {Number} reviewId reviewId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "Id": 1
 *     "user_id": 1,
 *     "list_id": 1,
 *     "content": "hello",
 *     "image": "image1"
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.get('/reviewinfo/:reviewId', function (req, res, next) {
  const reviewId = req.params["reviewId"];

  review.getReview(reviewId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

/**
 * @api {get} /reviews/listreviews/:reviewId Get List Review
 * @apiName GetListReviews
 * @apiGroup Review
 *
 * @apiParam (path) {Number} listId listId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "Id": 1
 *     "user_id": 1,
 *     "list_id": 1,
 *     "content": "hello",
 *     "image": "image1"
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 * {
 *     "Id": 2
 *     "user_id": 2,
 *     "list_id": 1,
 *     "content": "good burger",
 *     "image": "image2"
 *     "reg_date": "2018-11-27 13:53:10"
 * }
 */
router.get('/listreviews/:listId', function (req, res, next) {
  const listId = req.params["listId"];
  console.log(listId);

  review.getListReviews(listId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

/**
 * @api {put} /reviews/:reviewId Modify Review
 * @apiName ModifyReview
 * @apiGroup Review
 *
 * @apiParam (path) {Number} reviewId reviewId.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "Id": 1,
 *     "content": "hi",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "Id": 1
 *     "user_id": 1,
 *     "list_id": 1,
 *     "content": "hi",
 *     "image": "image1"
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.put('/:reviewId', function (req, res, next) {
  const reviewId = req.params["reviewId"];
  const content = req.body["content"];
  const modifyTime = moment().format('YYYY-MM-DD HH:mm:ss');

  review.modifyReview(reviewId, content, modifyTime)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @api {delete} /reviews/:reviewId Delete Review
 * @apiName DeleteReview
 * @apiGroup Review
 *
 * @apiParam (path) {Number} reviewId reviewId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
router.delete('/:reviewId', function (req, res, next) {
  const reviewId = req.params["reviewId"];

  review.deleteReview(reviewId)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
