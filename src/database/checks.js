const createError = require('http-errors');
const database = require('../database/database');
const checks = require('../model/checks');
const lists  = require('../database/lists');

const createCheck = async function (userId, listId) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Checks (user_id, list_id) VALUES ('${userId}', '${listId}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS id;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const checkId = result2[0]["id"];
  return await getCheck(checkId);
};

const getCheck = async function (checkId) {
  const sql = `SELECT * FROM Checks WHERE id = ${checkId}`;
  const checkResult = await database.queryOne(sql);

  if (checkResult.length == 0) {
    throw createError(404, `There is no checks with check Id is ${checkId}`);
  }

  return await checks.convertToCheck(checkResult[0]);
};

const getListUser = async function (userId, listId) {
  const sql = `SELECT * FROM Checks WHERE list_id = ${listId} AND user_id = ${userId}`;
  const checkResult = await database.queryOne(sql);

  if (checkResult.length == 0) {
    throw createError(404, `There is no users with list Id is ${listId} and user Id is ${userId}`);
  }

  return await await checks.convertToCheck(checkResult[0]);
};

const getListUsers = async function (listId) {
  const conn = database.createConnection();
  const sql = `SELECT * FROM Checks WHERE list_id = ${listId}`;
  const checkResult = await database.query(conn, sql);

  if (checkResult.length == 0) {
    throw createError(404, `There is no users with list Id is ${listId}`);
  }

  const result = []
  for (let i = 0; i < checkResult.length; i++) {
    result.push(checks.convertToCheck(checkResult[i]));
  }

  return await result;
};

// 0 또는 1의 값으로 줌
const modifyCheck = async function (userId, listId, want, like) {
  const queries = [];

  if (want != undefined) {
    queries.push(`want_check=\'${want}\'`);
  }
  if (like != undefined) {
    queries.push(`like_check=\'${like}\'`);
  }

  const sql = `UPDATE Checks SET ${queries.join(", ")} WHERE user_id = ${userId} AND list_id = ${listId};`;
  const result = await database.queryOne(sql);
  //const result2 = lists.modifyList(listId, undefined, undefined,
   //undefined, undefined, want, like);

  return await getListUser(userId, listId);
};

const deleteCheck = async function (userId, listId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Checks WHERE user_id = ${userId} AND list_id = ${listId};`;

  const result1 = await database.query(conn, sql1);

  return result1;
};

module.exports = { createCheck, getCheck, getListUser, getListUsers, modifyCheck, deleteCheck };