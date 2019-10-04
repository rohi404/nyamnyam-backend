const createError = require("http-errors");
const pool = require("./database");
const users = require("../model/users");

const createUser = async function(
  userId,
  password,
  nickname,
  email,
  image,
  background
) {
  const sqlwithImg = `INSERT INTO Users (user_id, password, nickname, email, image, background ) VALUES ('${userId}', '${password}', '${nickname}', '${email}', '${image}', '${background}' );`;
  const sqlwithoutImg = `INSERT INTO Users (user_id, password, nickname, email, background ) VALUES ('${userId}', '${password}', '${nickname}', '${email}', '${background}' );`;
  const sql1 = image !== undefined ? sqlwithImg : sqlwithoutImg;
  const result = await pool.execute(sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS user_key;`;
  const [result2] = await pool.execute(sql2);
  console.log(result2);
  const userKey = result2[0]["user_key"];
  return await getUser(userKey);
};

const getUser = async function(userKey) {
  const sql = `SELECT * FROM Users WHERE user_key = ${userKey}`;
  const [userResult] = await pool.execute(sql);

  if (userResult.length == 0) {
    throw createError(404, `There is no users with user key is ${userKey}`);
  }

  return await users.convertToUser(userResult[0]);
};

const getUserId = async function(Id) {
  const sql = `SELECT * FROM Users WHERE user_id = '${Id}'`;
  const [userResult] = await pool.execute(sql);

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
  const result = await pool.execute(sql);

  return await getUser(userKey);
};

const deleteUser = async function(userKey) {
  const sql1 = `DELETE FROM Users WHERE user_key = ${userKey};`;

  const result1 = await pool.execute(sql1);

  return result1;
};

module.exports = { createUser, getUser, getUserId, modifyUser, deleteUser };
