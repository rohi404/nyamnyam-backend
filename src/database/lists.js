var createError = require('http-errors');
var database = require('../database/database')
var lists = require('../model/lists')

const createList = async function (folderId, name, location, memo, image) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Lists (folder_id, name, location, memo, image) VALUES ('${folderId}', '${name}', '${location}', '${memo}', '${image}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS list_id;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const listId = result2[0]["list_id"];
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

const modifyList = async function (listId, listName, listLocation, listMemo, listImage) {
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
    //const currentFolder = getFolder(folderId);
    //const currentUser = currentFolder["userId"];
    //const updateUser = currentUser.concat(",", folderUser)

    queries.push(`image=\'${listImage}\'`);
  }

  const sql = `UPDATE Lists SET ${queries.join(", ")} WHERE list_id = ${listId};`;
  const result = await database.queryOne(sql);

  return await getList(listId);
};

const deleteList = async function (listId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Lists WHERE list_id = ${listId};`;
  const sql2 = `DELETE FROM Reviews WHERE list_id = ${listId};`;

  const result1 = await database.query(conn, sql1);
  const result2 = await database.query(conn, sql2);

  return result1;
};

module.export = createList;
module.export = getList;
module.export = modifyList;
module.export = deleteList;