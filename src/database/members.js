const createError = require('http-errors');
const database = require('../database/database')
const members = require('../model/members')
const folder = require('../database/folders')

const createMember = async function (userId, folderId) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Members (user_id, folder_id) VALUES ('${userId}', '${folderId}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS user_id;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const memberId = result2[0]["id"];
  return await getMember(memberId);
};

const getMember = async function (memberId) {
  const sql = `SELECT * FROM Members WHERE id = ${memberId};`;
  const memberResult = await database.queryOne(sql);

  if (memberResult.length == 0) {
    throw createError(404, `There is no users with user Id is ${memberId};`);
  }

  return await members.convertToMember(memberResult[0]);
};

const getUserFolders = async function (userId) {
  const conn = database.createConnection();

  const sql = `SELECT * FROM Members WHERE user_id = ${userId}`;
  const memberResult = await database.query(conn, sql);
  if (memberResult.length == 0) {
    throw createError(404, `There is no users with user Id is ${userId};`);
  }

  const result = []
  for (let i=0; i<memberResult.length; i++) {
    let name = members.convertToMember(memberResult[i])["folderId"]
    let tmp = await folder.getFolder(name)
    result.push(tmp);
  }
  return result;
};

const getFolderUsers = async function (folderId) {
  const conn = database.createConnection();

  const sql = `SELECT * FROM Members WHERE folder_id = ${folderId}`;
  const memberResult = await database.query(conn, sql);

  if (memberResult.length == 0) {
    throw createError(404, `There is no folder with folder Id is ${folderId}`);
  }

  const result = []
  for (let i=0; i<memberResult.length; i++) {
    result.push(members.convertToMember(memberResult[i])["userId"]);
  }

  return result;
};

const deleteMember = async function (userId, folderId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Members WHERE user_id = ${userId} AND folder_id = ${folderId};`;

  const result1 = await database.query(conn, sql1);

  return result1;
};

module.exports = { createMember, getMember, getUserFolders, getFolderUsers, deleteMember };