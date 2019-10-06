const express = require("express");
const router = express.Router();
const check = require("../database/checks");
const list = require("../database/lists");

/**
 * @api {post} /checks Create Check
 * @apiName CreateCheck
 * @apiGroup Check
 *
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "user_key": 1,
 *     "list_id": 1
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "id": 1,
 *     "user_key": 1,
 *     "list_id" 1,
 *     "want": 0,
 *     "like": 0
 * }
 */
router.post("/", function(req, res, next) {
  const userKey = req.body["user_key"];
  const listId = req.body["list_id"];

  check
    .createCheck(userKey, listId)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * @api {get} /checks/checkinfo/:checkId Get Check
 * @apiName GetCheck
 * @apiGroup Check
 *
 * @apiParam (path) {Number} checkId checkId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "id": 1,
 *     "user_key": 1,
 *     "list_id" 1,
 *     "want": 0,
 *     "like": 0
 * }
 */
router.get("/checkinfo/:checkId", function(req, res, next) {
  const checkId = req.params["checkId"];

  check
    .getCheck(checkId)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * @api {get} /users/listusers/:listId Get List Users
 * @apiName GetListUsers
 * @apiGroup Check
 *
 * @apiParam (path) {Number} listId listId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "id": 1,
 *     "user_key": 1,
 *     "list_id" 1,
 *     "want": 0,
 *     "like": 0
 * },
 * {
 *     "id": 2,
 *     "user_key": 2,
 *     "list_id" 1,
 *     "want": 1,
 *     "like": 0
 * },
 */
router.get("/listusers/:listId", function(req, res, next) {
  const listId = req.params["listId"];

  check
    .getListUsers(listId)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * @api {get} /checks/listuser/:userKey/:listId Get List User
 * @apiName GetListUser
 * @apiGroup Check
 *
 * @apiParam (path) {Number} listId listId.
 *  @apiParam (path) {Number} userKey userKey.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "id": 1,
 *     "user_key": 1,
 *     "list_id" 1,
 *     "want": 0,
 *     "like": 0
 * }
 */
router.get("/listuser/:userKey/:listId", function(req, res, next) {
  const listId = req.params["listId"];
  const userKey = req.params["userKey"];

  console.log(listId, userKey);

  check
    .getListUser(userKey, listId)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * @api {put} /checks Modify Check
 * @apiName ModifyCheck
 * @apiGroup Check
 *
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "user_key": 1,
 *     "list_id": 1
 *     "want": 0,
 *     "like": 1
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "id": 1,
 *     "user_key": 1,
 *     "list_id": 1
 *     "want": 0,
 *     "like": 1,
 * }
 */
router.put("/", function(req, res, next) {
  const userKey = req.body["user_key"];
  const listId = req.body["list_id"];
  const want = req.body["want"];
  const like = req.body["like"];

  check
    .modifyCheck(userKey, listId, want, like, list)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
