const createError = require("http-errors");
const pool = require("./database");
const checks = require("./checks");
const lists = require("../model/lists");
const members = require("../model/members");

const createList = async function(folderId, name, location, memo, image) {
  try {
    const sql1 = `INSERT INTO Lists (folder_id, name, location, memo, image) VALUES ('${folderId}', '${name}', '${location}', '${memo}', '${image}');`;
    const result = await pool.execute(sql1);
    const listId = result[0].insertId;

    const sql3 = `SELECT * FROM Members WHERE folder_id = ${folderId}`;
    const [memberResult] = await pool.execute(sql3);

    for (let i = 0; i < memberResult.length; i++) {
      let userKey = await members.convertToMember(memberResult[i])["userKey"];
      let sql = await checks.createCheck(userKey, listId);
    }

    return await getList(listId);
  } catch (e) {
    throw createError(e);
  }
};

const getList = async function(listId) {
  try {
    const sql = `SELECT * FROM Lists WHERE list_id = ${listId}`;
    const [listResult] = await pool.execute(sql);

    if (listResult.length == 0) {
      throw createError(404, `There is no list with list Id is ${listId}`);
    }

    return await lists.convertToList(listResult[0]);
  } catch (e) {
    throw createError(e);
  }
};

const getFolderLists = async function(folderId) {
  try {
    const sql = `SELECT * FROM Lists WHERE folder_id = ${folderId}`;
    const [listResult] = await pool.execute(sql);

    if (listResult.length == 0) {
      throw createError(404, `There is no list with folder Id is ${folderId}`);
    }

    const result = [];
    for (let i = 0; i < listResult.length; i++) {
      result.push(lists.convertToList(listResult[i]));
    }

    return await result;
  } catch (e) {
    throw createError(e);
  }
};
const getFolderListsCount = async function(folderId) {
  try {
    const sql = `SELECT * FROM Lists WHERE folder_id = ${folderId}`;
    const [listResult] = await pool.execute(sql);

    return listResult.length;
  } catch (e) {
    throw createError(e);
  }
};

const modifyList = async function(
  listId,
  listName,
  listLocation,
  listMemo,
  listImage,
  wantCount,
  likeCount,
  listVisited
) {
  const users = await checks.getListUsers(listId);
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
    queries.push(`image=\'${listImage}\'`);
  }
  if (listVisited != undefined) {
    queries.push(`visited=\'${listVisited}\'`);
  }
  // wantCount, likeCount 입력이 1이면 카운트수 증가 0이면 카운트수 감소
  if (wantCount != undefined) {
    if (wantCount === 1) {
      let count = 0;
      for (let i = 0; i < users.length; i++) {
        count += users[i]["wantCheck"];
      }
      queries.push(`want_count=\'${count}\'`);
    }
  }
  if (likeCount != undefined) {
    if (likeCount === 1) {
      let count = 0;
      for (let i = 0; i < users.length; i++) {
        count += users[i]["likeCheck"];
      }
      queries.push(`like_count=\'${count}\'`);
    }
  }

  const sql = `UPDATE Lists SET ${queries.join(
    ", "
  )} WHERE list_id = ${listId};`;

  try {
    const result = await pool.execute(sql);

    return await getList(listId);
  } catch (e) {
    throw createError(e);
  }
};

const deleteList = async function(listId) {
  const sql1 = `DELETE FROM Lists WHERE list_id = ${listId};`;
  const sql2 = `DELETE FROM Reviews WHERE list_id = ${listId};`;
  const sql3 = `DELETE FROM Checks WHERE list_id = ${listId};`;

  try {
    const result1 = await pool.execute(sql1);
    const result2 = await pool.execute(sql2);
    const result3 = await pool.execute(sql3);

    return result1;
  } catch (e) {
    throw createError(e);
  }
};

module.exports = {
  createList,
  getList,
  getFolderLists,
  getFolderListsCount,
  modifyList,
  deleteList
};
