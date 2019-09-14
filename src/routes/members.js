const express = require("express");
const router = express.Router();
const member = require("../database/members");
const folder = require("../database/folders");

/**
 * @api {post} /members Create Member
 * @apiName CreateMember
 * @apiGroup Member
 *
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "user_key": 1,
 *     "folder_id": 1,
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "id" : 1
 *     "user_key": 1,
 *     "folder_id": 1
 * }
 */
router.post("/", function(req, res, next) {
  const userKey = req.body["user_key"];
  const folderId = req.body["folder_id"];

  member
    .createMember(userKey, folderId)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

// 유저 별 폴더 정보 가져오기
/**
 * @api {get} /members/userfolders/:userKey Get UserFolders
 * @apiName GetUserFolders
 * @apiGroup Member
 *
 * @apiParam (path) {Number} userKey userKey.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 *[
 *  {
 *     "folder_id": 1,
 *     "leader": 1,
 *     "name": "folder1"
 *     "emoji": "013",
 *     "color": "#ffffff",
 *     "link": "http://nyamnyam",
 *     "reg_date": "2018-11-24 14:52:30"
 *  },
 *  {
 *     "folder_id": 2,
 *     "leader": 2,
 *     "name": "folder2"
 *     "emoji": "012",
 *     "color": "#000000",
 *     "link": "http://nyamnyam/2",
 *     "reg_date": "2018-11-30 13:22:10"
 *  }
 * ]
 */
router.get("/userfolders/:userKey", function(req, res, next) {
  const userKey = req.params["userKey"];

  member
    .getUserFolders(userKey, folder)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

// 폴더 별 유저 정보 가져오기
/**
 * @api {get} /members/folderusers/:folderId Get FolderUsers
 * @apiName GetFolderUsers
 * @apiGroup Member
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 *[
 *  {
 *     "userKey": 1,
 *     "id": "user1",
 *     "password": "qwerty",
 *     "nickname": "hello",
 *     "image": "image1",
 *     "background": "image2"
 *     "reg_date": "2018-11-24 14:52:30"
 *  },
 *  {
 *     "userKey": 2,
 *     "id": "user2",
 *     "password": "qwerty",
 *     "nickname": "hello2",
 *     "image": "image3",
 *     "background": "image4"
 *     "reg_date": "2018-11-24 14:52:30"
 *  }
 * ]
 */
router.get("/folderusers/:folderId", function(req, res, next) {
  const folderId = req.params["folderId"];

  member
    .getFolderUsers(folderId)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
