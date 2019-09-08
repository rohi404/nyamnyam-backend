const express = require('express');
const router = express.Router();
const folder = require('../database/folders')

// 폴더 추가 - 폴더 생성
/**
 * @api {post} /folders Create Folder
 * @apiName CreateFolder
 * @apiGroup Folder
 *
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "user_id": 1,
 *     "name": "folder1",
 *     "emoji": "013",
 *     "color": "#ffffff",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "folder_id": 1,
 *     "leader": 1,
 *     "name": "folder1"
 *     "emoji": "013",
 *     "color": "#ffffff",
 *     "link": "http://nyamnyam",
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.post('/', function(req, res, next) {
  const folderName = req.body["name"];
  const folderEmoji = req.body["emoji"];
  const folderColor = req.body["color"];
  const folderLeader = req.body["user_id"];

  folder.createFolder(folderLeader, folderName, folderEmoji, folderColor)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

// 폴더 정보 가져오기
/**
 * @api {get} /folders/:folderId Get Folder
 * @apiName GetFolder
 * @apiGroup Folder
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "folder_id": 1,
 *     "leader": 1,
 *     "name": "folder1"
 *     "emoji": "013",
 *     "color": "#ffffff",
 *     "link": "http://nyamnyam",
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.get('/:folderId', function (req, res, next) {
  const folderId = req.params["folderId"];

  folder.getFolder(folderId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

// 폴더 정보 수정(이름, 이모지, 배경 컬러)
/**
 * @api {put} /folders/:folderId Modify Folder
 * @apiName ModifyFolder
 * @apiGroup Folder
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "user_id": 1,
 *     "name": "folder2",
 *     "emoji": "014",
 *     "color": "#fffffg",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "folder_id": 1,
 *     "leader": 1,
 *     "name": "folder2"
 *     "emoji": "014",
 *     "color": "#fffffg",
 *     "link": "http://nyamnyam",
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.put('/:folderId', function (req, res, next) {
  const folderId = req.params["folderId"];

  folder.modifyFolder(folderId, req.body["name"], req.body["emoji"], req.body["color"], req.body["user_id"])
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

// 폴더 삭제
/**
 * @api {delete} /folders/:folderId Delete Folder
 * @apiName DeleteFolder
 * @apiGroup Folder
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
router.delete('/:folderId', function (req, res, next) {
  const folderId = req.params["folderId"];

  folder.deleteFolder(folderId)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
