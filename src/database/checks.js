const createError = require("http-errors");
const pool = require("./database");
const checks = require("../model/checks");

const createCheck = async function(userKey, listId) {
  const sql1 = `INSERT INTO Checks (user_key, list_id) VALUES ('${userKey}', '${listId}');`;
  const result = await pool.execute(sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS id;`;
  const [result2] = await pool.execute(sql2);

  const checkId = result2[0]["id"];
  return await getCheck(checkId);
};

const getCheck = async function(checkId) {
  const sql = `SELECT * FROM Checks WHERE id = ${checkId}`;
  const [checkResult] = await pool.execute(sql);

  if (checkResult.length == 0) {
    throw createError(404, `There is no checks with check Id is ${checkId}`);
  }

  return await checks.convertToCheck(checkResult[0]);
};

const getListUser = async function(userKey, listId) {
  const sql = `SELECT * FROM Checks WHERE list_id = ${listId} AND user_key = ${userKey}`;
  const [checkResult] = await pool.execute(sql);

  if (checkResult.length == 0) {
    throw createError(
      404,
      `There is no users with list Id is ${listId} and user Key is ${userKey}`
    );
  }

  return await await checks.convertToCheck(checkResult[0]);
};

const getListUsers = async function(listId) {
  const sql = `SELECT * FROM Checks WHERE list_id = ${listId}`;
  const [checkResult] = await pool.execute(sql);

  if (checkResult.length == 0) {
    throw createError(404, `There is no users with list Id is ${listId}`);
  }

  const result = [];
  for (let i = 0; i < checkResult.length; i++) {
    result.push(checks.convertToCheck(checkResult[i]));
  }

  return await result;
};

// 0 또는 1의 값만 받아온다.
const modifyCheck = async function(userKey, listId, want, like, lists) {
  const queries = [];

  if (want != undefined) {
    queries.push(`want_check=\'${want}\'`);
  }
  if (like != undefined) {
    queries.push(`like_check=\'${like}\'`);
  }

  const sql = `UPDATE Checks SET ${queries.join(
    ", "
  )} WHERE user_key = ${userKey} AND list_id = ${listId};`;
  const result = await pool.execute(sql);
  const result2 = await lists.modifyList(
    listId,
    undefined,
    undefined,
    undefined,
    undefined,
    want,
    like
  );

  return await getListUser(userId, listId);
};

const deleteCheck = async function(userKey, listId) {
  const sql1 = `DELETE FROM Checks WHERE user_key = ${userKey} AND list_id = ${listId};`;

  const result1 = await pool.execute(sql1);

  return result1;
};

module.exports = {
  createCheck,
  getCheck,
  getListUser,
  getListUsers,
  modifyCheck,
  deleteCheck
};
