const createError = require("http-errors");
const pool = require("./database");
const images = require("../model/images");

const createImage = async function(listId, url, order) {
  try {
    const sql = `INSERT INTO Images (list_id, url, img_order) VALUES ('${listId}', '${url}', '${order}');`;
    const result = await pool.execute(sql);

    const imageId = result[0].insertId;

    return await getImage(imageId);
  } catch (e) {
    throw createError(e);
  }
};

const createAllImages = async function(listId, urls) {
  try {
    for (let i = 0; i < urls.length; i++) {
      let sql1 = `INSERT INTO Images (list_id, url, img_order) VALUES ('${listId}', '${urls[i]}', '${i}');`;
      let result = await pool.execute(sql1);
    }
    return;
  } catch (e) {
    throw createError(e);
  }
};

const getImage = async function(imageId) {
  try {
    const sql = `SELECT * FROM Images WHERE image_id = ${imageId};`;

    const [imageResult] = await pool.execute(sql);

    if (imageResult.length == 0) {
      throw createError(404, `There is no images with image Id is ${imageId};`);
    }

    return await images.convertToImage(imageResult[0]);
  } catch (e) {
    throw createError(e);
  }
};

const getListImage = async function(listId) {
  try {
    const sql = `SELECT * FROM Images WHERE list_id = ${listId};`;
    const [imageResult] = await pool.execute(sql);

    const result = [];
    for (let i = 0; i < imageResult.length; i++) {
      let tmp = images.convertToImage(imageResult[i]);
      result.push(tmp);
    }

    return result;
  } catch (e) {
    throw createError(e);
  }
};

const modifyImage = async function(imageId, url) {
  const queries = [];

  if (url != undefined) {
    queries.push(`url=\'${url}\'`);
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
  const sql1 = `DELETE FROM Images WHERE image_id = ${imageId};`;
  try {
    const [result1] = await pool.execute(sql1);

    return result1;
  } catch (e) {
    throw createError(e);
  }
};

module.exports = {
  createImage,
  createAllImages,
  getImage,
  getListImage,
  modifyImage,
  deleteImage
};
