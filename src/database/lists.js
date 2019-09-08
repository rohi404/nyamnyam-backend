const createError = require('http-errors');
const database = require('../database/database');
const lists = require('../model/lists');
const checks = require('../database/checks');
const members = require('../model/members');

const createList = async function (folderId, name, location, memo, image) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Lists (folder_id, name, location, memo, image) VALUES ('${folderId}', '${name}', '${location}', '${memo}', '${image}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS list_id;`;
  const result2 = await database.query(conn, sql2);
  const listId = result2[0]["list_id"];

  const sql3 = `SELECT * FROM Members WHERE folder_id = ${folderId}`;
  const memberResult = await database.query(conn, sql3);

  for(let i=0; i<memberResult.length; i++){
    let userId = members.convertToMember(memberResult[i])["userId"];
    console.log(userId);
    let sql  = checks.createCheck(userId, listId);
  }

  database.endConnection(conn);

  return await getList(listId);
};

const getList = async function (listId) {
  const sql = `SELECT * FROM Lists WHERE list_id = ${listId}`;
  const listResult = await database.queryOne(sql);

  if (listResult.length == 0) {
    throw createError(404, `There is no list with list Id is ${listId}`);
  }

  return await lists.convertToList(listResult[0]);
};

const getFolderLists = async function (folderId) {
  const conn = database.createConnection();
  const sql = `SELECT * FROM Lists WHERE folder_id = ${folderId}`;
  const listResult = await database.query(conn, sql);

  if (listResult.length == 0) {
    throw createError(404, `There is no list with folder Id is ${folderId}`);
  }

  const result = []
  for (let i = 0; i < listResult.length; i++) {
    result.push(lists.convertToList(listResult[i]));
  }

  return await result;
};

const modifyList = async function (listId, listName, listLocation, listMemo, listImage, wantCount, likeCount) {
  const queries = [];

  if (listName != undefined) {
    queries.push(`name=\'${listName}\'`);
  }
  if (listLocation != undefined) {
    queries.push(`location=\'${listLocation}\'`);
  }
  if (listMemo != undefined) {
    queries.push(`memo=\'${listMemo}\'`);
  }
  if (listImage != undefined) {
    queries.push(`image=\'${listImage}\'`);
  }
  if (wantCount != undefined) {
    queries.push(`want_count=\'${wantCount}\'`);
  }
  if (likeCount != undefined) {
    queries.push(`like_count=\'${likeCount}\'`);
  }

  const sql = `UPDATE Lists SET ${queries.join(", ")} WHERE list_id = ${listId};`;
  const result = await database.queryOne(sql);

  return await getList(listId);
};

const deleteList = async function (listId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Lists WHERE list_id = ${listId};`;
  const sql2 = `DELETE FROM Reviews WHERE list_id = ${listId};`;
  const sql3 = `DELETE FROM Checks WHERE list_id = ${listId};`;

  const result1 = await database.query(conn, sql1);
  const result2 = await database.query(conn, sql2);
  const result3 = await database.query(conn, sql3);

  return result1;
};

module.exports = { createList, getList, getFolderLists, modifyList, deleteList };