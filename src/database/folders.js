const createError = require("http-errors");
const pool = require("./database");
const folders = require("../model/folders");
const members = require("./members");

const createFolder = async function(leader, name, emoji, color) {
  try {
    const sql1 = `INSERT INTO Folders (leader, name, emoji, color) VALUES ('${leader}', '${name}', '${emoji}', '${color}');`;
    const result = await pool.execute(sql1);
    const folderId = result[0].insertId;
    const result3 = members.createMember(leader, folderId);

    return await getFolder(folderId);
  } catch (e) {
    throw createError(e);
  }
};

const getFolder = async function(folderId) {
  const sql = `SELECT * FROM Folders WHERE folder_id = ${folderId}`;
  const [folderResult] = await pool.execute(sql);

  if (folderResult.length == 0) {
    throw createError(404, `There is no folders with folder Id is ${folderId}`);
  }

  return await folders.convertToFolder(folderResult[0]);
};

const modifyFolder = async function(
  folderId,
  folderName,
  folderEmoji,
  folderColor,
  folderLeader,
  folderLink
) {
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
  if (folderLeader != undefined) {
    queries.push(`leader=\'${folderLeader}\'`);
  }
  if (folderLink != undefined) {
    queries.push(`link=\'${folderLink}\'`);
  }

  const sql = `UPDATE Folders SET ${queries.join(
    ", "
  )} WHERE folder_id = ${folderId};`;

  try {
    const result = await pool.execute(sql);

    return await getFolder(folderId);
  } catch (e) {
    throw createError(e);
  }
};

const deleteFolder = async function(folderId) {
  const sql1 = `DELETE FROM Folders WHERE folder_id = ${folderId};`;
  const sql2 = `DELETE FROM Lists WHERE folder_id = ${folderId};`;
  const sql3 = `DELETE FROM Members WHERE folder_id = ${folderId};`;

  try {
    const result1 = await pool.execute(sql1);
    const result2 = await pool.execute(sql2);
    const result3 = await pool.execute(sql3);

    return result1;
  } catch (e) {
    throw createError(e);
  }
};

module.exports = { createFolder, getFolder, modifyFolder, deleteFolder };
