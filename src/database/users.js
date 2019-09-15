const createError = require("http-errors");
const database = require("../database/database");
const users = require("../model/users");

const createUser = async function(
  userId,
  password,
  nickname,
  email,
  image,
  background
) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Users (user_id, password, nickname, email, image, background ) VALUES ('${userId}', '${password}', '${nickname}', '${email}', '${image}', '${background}' );`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS user_key;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const userKey = result2[0]["user_key"];
  return await getUser(userKey);
};

const getUser = async function(userKey) {
  const sql = `SELECT * FROM Users WHERE user_key = ${userKey}`;
  const userResult = await database.queryOne(sql);

  if (userResult.length == 0) {
    throw createError(404, `There is no users with user key is ${userKey}`);
  }

  return await users.convertToUser(userResult[0]);
};

const getUserId = async function(Id) {
  const sql = `SELECT * FROM Users WHERE user_id = '${Id}'`;
  const userResult = await database.queryOne(sql);

  if (userResult.length == 0) {
    throw createError(404, `There is no users with user id is ${Id}`);
  }

  return await users.convertToUser(userResult[0]);
};

const modifyUser = async function(
  userKey,
  userNickname,
  userProfile,
  userBackground
) {
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

  const sql = `UPDATE Users SET ${queries.join(
    ", "
  )} WHERE user_key = ${userKey};`;
  const result = await database.queryOne(sql);

  return await getUser(userKey);
};

const deleteUser = async function(userKey) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Users WHERE user_key = ${userKey};`;

  const result1 = await database.query(conn, sql1);

  return result1;
};

module.exports = { createUser, getUser, getUserId, modifyUser, deleteUser };
