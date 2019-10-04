const createError = require("http-errors");
const pool = require("./database");
const images = require("../model/images");

const createImage = async function(listId, url) {
  for (let i = 0; i < url.length; i++) {
    let sql1 = `INSERT INTO Images (list_id, url) VALUES ('${listId}', '${url[i]}');`;
    let result = await pool.execute(sql1);
  }
  const sql2 = `SELECT LAST_INSERT_ID() AS image_id;`;
  const [result2] = await pool.execute(sql2);

  const imageId = result2[0]["image_id"];
  return await getImage(imageId);
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

  if (imageResult.length == 0) {
    throw createError(404, `There is no images with list Id is ${listId};`);
  }

  const result = [];
  for (let i = 0; i < imageResult.length; i++) {
    let tmp = images.convertToImage(imageResult[i]);
    result.push(tmp);
  }

  return result;
};

const modifyImage = async function(imageId, url) {
  const queries = [];

  if (url != undefined) {
    queries.push(`url=\'${url}\'`);
  }

  const sql = `UPDATE Images SET ${queries.join(
    ", "
  )} WHERE image_id = ${imageId};`;
  const result = await pool.execute(sql);

  return await getImage(imageId);
};

const deleteImage = async function(imageId) {
  const sql1 = `DELETE FROM Images WHERE image_id = ${imageId};`;

  const [result1] = await pool.execute(sql1);

  return result1;
};

module.exports = {
  createImage,
  getImage,
  getListImage,
  modifyImage,
  deleteImage
};
