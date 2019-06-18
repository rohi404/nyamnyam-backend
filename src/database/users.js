const createError = require('http-errors');
const database = require('../database/database')
const users = require('../model/users')

const createUser = async function (id, password, nickname, image, background) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Users (id, password, nickname, image, background) VALUES ('${id}', '${password}', '${nickname}', '${image}', '${background}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS user_id;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const userId = result2[0]["user_id"];
  return await getUser(userId);
};

const getUser = async function (userId) {
  const sql = `SELECT * FROM Users WHERE user_id = ${userId}`;
  const userResult = await database.queryOne(sql);

  if (userResult.length == 0) {
    throw createError(404, `There is no users with user Id is ${userId}`);
  }

  return await users.convertToUser(userResult[0]);
};

const modifyUser = async function (userId, userNickname, userProfile, userBackground) {
  const queries = [];

  if (userNickname != undefined) {
    queries.push(`nickname=\'${userNickname}\'`);
  }
  if (userProfile != undefined) {
    queries.push(`image=\'${userProfile}\'`);
  }
  if (userBackground != undefined) {
    queries.push(`background=\'${userBackground}\'`);
  }

  const sql = `UPDATE Users SET ${queries.join(", ")} WHERE user_id = ${userId};`;
  const result = await database.queryOne(sql);

  return await getUser(userId);
};

const deleteUser = async function (userId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Users WHERE user_id = ${userId};`;

  const result1 = await database.query(conn, sql1);

  return result1;
};

module.exports = { createUser, getUser, modifyUser, deleteUser };