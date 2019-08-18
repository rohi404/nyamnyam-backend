const createError = require('http-errors');
const database = require('../database/database')
const folders = require('../model/folders')

const createFolder = async function (leader, name, emoji, color) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Folders (leader, name, emoji, color) VALUES ('${leader}', '${name}', '${emoji}', '${color}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS folder_id;`;
  const result2 = await database.query(conn, sql2);

  const folderId = result2[0]["folder_id"];

  const sql3 = `INSERT INTO Members (user_id, folder_id) VALUES ('${leader}', '${folderId}');`;
  const result3 = await database.query(conn, sql3);

  database.endConnection(conn);
  return await getFolder(folderId);
};

const getFolder = async function (folderId) {
  const sql = `SELECT * FROM Folders WHERE folder_id = ${folderId}`;
  const folderResult = await database.queryOne(sql);

  if (folderResult.length == 0) {
    throw createError(404, `There is no folders with folder Id is ${folderId}`);
  }

  return await folders.convertToFolder(folderResult[0]);
};

const modifyFolder = async function (folderId, folderName, folderEmoji, folderColor) {
  const queries = [];

  if (folderName != undefined) {
    queries.push(`name=\'${folderName}\'`);
  }
  if (folderEmoji != undefined) {
    queries.push(`emoji=\'${folderEmoji}\'`);
  }
  if (folderColor != undefined) {
    queries.push(`color=\'${folderColor}\'`);
  }

  const sql = `UPDATE Folders SET ${queries.join(", ")} WHERE folder_id = ${folderId};`;
  const result = await database.queryOne(sql);

  return await getFolder(folderId);
};

const deleteFolder = async function (folderId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Folders WHERE folder_id = ${folderId};`;
  const sql2 = `DELETE FROM Lists WHERE folder_id = ${folderId};`;

  const result1 = await database.query(conn, sql1);
  const result2 = await database.query(conn, sql2);

  return result1;
};

module.exports = { createFolder, getFolder, modifyFolder, deleteFolder };