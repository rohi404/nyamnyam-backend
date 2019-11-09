const createError = require("http-errors");
const pool = require("./database");
const members = require("../model/members");
const user = require("../database/users");

const createMember = async function(userKey, folderId) {
  try {
    const sql = `SELECT * FROM Members WHERE user_key= ${userKey} AND folder_id=${folderId};`;
    const [member] = await pool.execute(sql);

    if (member.length == 0) {
      const sql1 = `INSERT INTO Members (user_key, folder_id) VALUES ('${userKey}', '${folderId}')`;
      const result = await pool.execute(sql1);

      const memberId = result[0].insertId;
      return await getMember(memberId);
    } else {
      throw createError(
        404,
        `There is already member with user Id is ${userKey} and folder Id is ${folderId};`
      );
    }
  } catch (e) {
    throw createError(e);
  }
};

const getMember = async function(memberId) {
  try {
    const sql = `SELECT * FROM Members WHERE id = ${memberId};`;
    const [memberResult] = await pool.execute(sql);

    if (memberResult.length == 0) {
      throw createError(
        404,
        `There is no users with member Id is ${memberId};`
      );
    }

    return await members.convertToMember(memberResult[0]);
  } catch (e) {
    throw createError(e);
  }
};

const getUserFolders = async (userKey, folder) => {
  try {
    const sql = `SELECT * FROM Members WHERE user_key = ${userKey}`;
    const [memberResult] = await pool.execute(sql);

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
  } catch (e) {
    throw createError(e);
  }
};

const getFolderUsers = async function(folderId) {
  try {
    const sql = `SELECT * FROM Members WHERE folder_id = ${folderId}`;
    const [memberResult] = await pool.execute(sql);

    if (memberResult.length == 0) {
      throw createError(
        404,
        `There is no folder with folder Id is ${folderId}`
      );
    }

    const result = [];
    for (let i = 0; i < memberResult.length; i++) {
      let name = members.convertToMember(memberResult[i])["userKey"];
      let tmp = await user.getUser(name);
      result.push(tmp);
    }
    return await result;
  } catch (e) {
    throw createError(e);
  }
};

const getAllUserFolders = async function(userKey, folder) {
  try {
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
  } catch (e) {
    throw createError(e);
  }
};

const deleteMember = async function(userKey, folderId) {
  try {
    const sql1 = `DELETE FROM Members WHERE user_key = ${userKey} AND folder_id = ${folderId};`;
    const result1 = await pool.execute(sql1);

    return result1;
  } catch (e) {
    throw createError(e);
  }
};

module.exports = {
  createMember,
  getMember,
  getUserFolders,
  getFolderUsers,
  getAllUserFolders,
  deleteMember
};
