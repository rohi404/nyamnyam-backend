const express = require('express');
const router = express.Router();
const list = require('../database/lists');
const image = require('../database/images');

// 리스트 추가
/**
 * @api {post} /lists/:folderId Create List
 * @apiName CreateList
 * @apiGroup List
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "name": "냠냠버거",
 *     "location": "서울시 동작구 흑석동 150-4",
 *     "memo": "수제버거 맛집",
 *     "image": "image1",
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "listId": 1,
 *     "folderId": 2,
 *     "name": "냠냠버거",
 *     "location": "서울시 동작구 흑석동 150-4",
 *     "memo": "수제버거 맛집",
 *     "image": "image1",
 *     "want_count": 0,
 *     "like_count": 0,
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.post('/:folderId', function(req, res, next) {
  const folderId = req.params["folderId"]
  const listName = req.body["name"];
  const listLocation = req.body["location"];
  const listMemo = req.body["memo"];
  const listImage = req.body["image"];

  list.createList(folderId, listName, listLocation, listMemo, listImage)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

// 리스트 정보 가져오기
/**
 * @api {get} /lists/listinfo/:listId Get List
 * @apiName GetList
 * @apiGroup List
 *
 * @apiParam (path) {Number} listId listId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "listId": 1,
 *     "folderId": 2,
 *     "name": "냠냠버거",
 *     "location": "서울시 동작구 흑석동 150-4",
 *     "memo": "수제버거 맛집",
 *     "image": "image1",
 *     "want_count": 1,
 *     "like_count": 2,
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.get('/listinfo/:listId', function (req, res, next) {
  const listId = req.params["listId"];

  list.getList(listId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

// 리스트 정보 가져오기
/**
 * @api {get} /lists/folderlists/:folderId Get Folder Lists
 * @apiName GetFolderLists
 * @apiGroup List
 *
 * @apiParam (path) {Number} folderId folderId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "listId": 1,
 *     "folderId": 2,
 *     "name": "냠냠버거",
 *     "location": "서울시 동작구 흑석동 150-4",
 *     "memo": "수제버거 맛집",
 *     "image": "image1",
 *     "want_count": 1,
 *     "like_count": 2,
 *     "reg_date": "2018-11-24 14:52:30"
 * },
 * {
 *     "listId": 2,
 *     "folderId": 2,
 *     "name": "얌얌피자",
 *     "location": "서울시 도봉구 창동 140-3",
 *     "memo": "수제피자 맛집",
 *     "image": "image2",
 *     "want_count": 2,
 *     "like_count": 0,
 *     "reg_date": "2018-11-26 23:32:10"
 * }
 */
router.get('/folderlists/:folderId', function (req, res, next) {
  const folderId = req.params["folderId"];
  console.log(folderId);

  list.getFolderLists(folderId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    })
});

// 리스트 정보 수정(이름, 위치, 메모, 사진)
/**
 * @api {put} /lists/:listId Modify List
 * @apiName ModifyList
 * @apiGroup List
 *
 * @apiParam (path) {Number} listId listId.
 * @apiParam {Json} body body.
 * @apiParamExample {json} User Action:
 * {
 *     "name": "얌얌버거",
 *     "location": "서울시 동작구 흑석동 80-1",
 *     "memo": "베이컨 꼭 추가해야함",
 *     "image": "image2",
 *     "want_count": 1,
 *     "like_count": 2,
 *     "payload": {}
 * }
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *     "listId": 1,
 *     "folderId": 2,
 *     "name": "얌얌버거",
 *     "location": "서울시 동작구 흑석동 80-1",
 *     "memo": "베이컨 꼭 추가해야함",
 *     "image": "image2",
 *     "want_count": 1,
 *     "like_count": 2,
 *     "reg_date": "2018-11-24 14:52:30"
 * }
 */
router.put('/:listId', function (req, res, next) {
  const listId = req.params["listId"];

  list.modifyList(listId, req.body["name"], req.body["location"], req.body["memo"], req.body["image"], req.body["want_count"], req.body["like_count"])
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

// 리스트 삭제
/**
 * @api {delete} /lists/:listId Delete List
 * @apiName DeleteList
 * @apiGroup List
 *
 * @apiParam (path) {Number} listId listId.
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
router.delete('/:listId', function (req, res, next) {
  const listId = req.params["listId"];

  list.deleteList(listId)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
