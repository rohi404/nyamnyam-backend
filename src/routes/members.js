const express = require('express');
const router = express.Router();
const member = require('../database/members')

// 유저 별 폴더 정보 가져오기
/**
 * @api {get} /members/userfolders/:userId Get UserFolders
 * @apiName GetUserFolders
 * @apiGroup User
 *
 * @apiParam (path) {Number} userId userId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 *[ 
 *  {
 *     "name": "folder1",
 *     "emoji": "013",
 *     "color": "#ffffff",
 *     "payload": {}
 *  },
 *  {
 *     "name": "folder2",
 *     "emoji": "015",
 *     "color": "#ffffff",
 *     "payload": {}
 *  }
 * ]
 */
router.get('userfolders/:userId', function (req, res, next) {
  const userId = req.params["userId"];

  member.getUserFolders(userId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    })
});

// 폴더 별 유저 정보 가져오기
/**
 * @api {get} /members/folderusers/:folderId Get FolderUsers
 * @apiName GetFolderUsers
 * @apiGroup Folder
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 *[ 
 *  {
 *     "user_id": 1,
 *     "id": "user1",
 *     "password": "qwerty",
 *     "nickname": "hello",
 *     "image": "image1",
 *     "background": "image2"
 *     "reg_date": "2018-11-24 14:52:30"
 *  },
 *  {
 *     "user_id": 2,
 *     "id": "user2",
 *     "password": "qwerty",
 *     "nickname": "hello2",
 *     "image": "image3",
 *     "background": "image4"
 *     "reg_date": "2018-11-24 14:52:30"
 *  }
 * ]
 */
router.get('folderusers/:folderId', function (req, res, next) {
    const folderId = req.params["folderId"];

    member.getFolderUsers(folderId)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            next(err);
        })
});

module.exports = router;
