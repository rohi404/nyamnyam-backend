const createError = require("http-errors");
const pool = require("./database");
const images = require("../model/images");

const createImage = async function(listId, url) {
  let result;
  try {
    for (let i = 0; i < url.length; i++) {
      let sql1 = `INSERT INTO Images (list_id, url) VALUES ('${listId}', '${url[i]}');`;
      result = await pool.execute(sql1);
    }
    const imageId = result[0].insertId;

    return await getImage(imageId);
  } catch (e) {
    throw createError(e);
  }
};

const getImage = async function(imageId) {
  const sql = `SELECT * FROM Images WHERE image_id = ${imageId};`;
  const [imageResult] = await pool.execute(sql);

  if (imageResult.length == 0) {
    throw createError(404, `There is no images with image Id is ${imageId};`);
  }

  return await images.convertToImage(imageResult[0]);
};

const getListImage = async function(listId) {
  const sql = `SELECT * FROM Images WHERE list_id = ${listId};`;
  const [imageResult] = await pool.execute(sql);

  const result = [];
  for (let i = 0; i < imageResult.length; i++) {
    let tmp = images.convertToImage(imageResult[i]);
    result.push(tmp);
  }

  return result;
};

const modifyImage = async function(imageId, url, order) {
  const queries = [];

  if (url != undefined) {
    queries.push(`url=\'${url}\'`);
  }
  if (order != undefined) {
    queries.push(`order=${order}`);
  }

  const sql = `UPDATE Images SET ${queries.join(
    ", "
  )} WHERE image_id = ${imageId};`;

  try {
    const result = await pool.execute(sql);

    return await getImage(imageId);
  } catch (e) {
    throw createError(e);
  }
};

const deleteImage = async function(imageId) {
  try {
    const sql1 = `DELETE FROM Images WHERE image_id = ${imageId};`;
    const [result1] = await pool.execute(sql1);

    return result1;
  } catch (e) {
    throw createError(e);
  }
};

module.exports = {
  createImage,
  getImage,
  getListImage,
  modifyImage,
  deleteImage
};
