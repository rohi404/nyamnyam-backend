const createError = require("http-errors");
const database = require("../database/database");
const members = require("../model/members");
const user = require("../database/users");

const createMember = async function(userKey, folderId) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Members (user_key, folder_id) VALUES ('${userKey}', '${folderId}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS id;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const memberId = result2[0]["id"];
  return await getMember(memberId);
};

const getMember = async function(memberId) {
  const sql = `SELECT * FROM Members WHERE id = ${memberId};`;
  const memberResult = await database.queryOne(sql);

  if (memberResult.length == 0) {
    throw createError(404, `There is no users with user Id is ${memberId};`);
  }

  return await members.convertToMember(memberResult[0]);
};

const getUserFolders = async (userKey, folder) => {
  const conn = database.createConnection();
  const sql = `SELECT * FROM Members WHERE user_key = ${userKey}`;

  const memberResult = await database.query(conn, sql);
  if (memberResult.length == 0) {
    throw createError(404, `There is no users with user Id is ${userKey};`);
  }
  const result = [];
  for (let i = 0; i < memberResult.length; i++) {
    let name = members.convertToMember(memberResult[i])["folderId"];
    let tmp = await folder.getFolder(name);
    result.push(tmp);
  }
  return await result;
};

const getFolderUsers = async function(folderId) {
  const conn = database.createConnection();
  const sql = `SELECT * FROM Members WHERE folder_id = ${folderId}`;
  const memberResult = await database.query(conn, sql);

  if (memberResult.length == 0) {
    throw createError(404, `There is no folder with folder Id is ${folderId}`);
  }
  const result = [];
  for (let i = 0; i < memberResult.length; i++) {
    let name = members.convertToMember(memberResult[i])["userKey"];
    let tmp = await user.getUser(name);
    result.push(tmp);
  }
  return await result;
};

const getAllUserFolders = async function(userKey, folder) {
  const folderResult = await getUserFolders(userKey, folder);

  if (folderResult.length == 0) {
    throw createError(404, `There is no folders with user Id is ${userKey};`);
  }

  let memberResult = [];
  for (let i = 0; i < folderResult.length; i++) {
    let tmp = await getFolderUsers(folderResult[i]["folderId"]);
    memberResult.push(folderResult[i]);
    memberResult[i]["count"] = tmp.length;
    memberResult[i]["member"] = tmp;
  }

  return await memberResult;
};


const deleteMember = async function(userKey, folderId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Members WHERE user_key = ${userKey} AND folder_id = ${folderId};`;

  const result1 = await database.query(conn, sql1);

  return result1;
};

module.exports = {
  createMember,
  getMember,
  getUserFolders,
  getFolderUsers,
  getAllUserFolders,
  deleteMember
};
