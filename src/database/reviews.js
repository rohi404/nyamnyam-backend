const createError = require("http-errors");
const pool = require("./database");
const reviews = require("../model/reviews");

const createReview = async function(userKey, listId, content, image) {
  const sql1 = `INSERT INTO Reviews (user_key, list_id, content, image) VALUES ('${userKey}', '${listId}', '${content}', '${image}');`;
  const result = await pool.execute(sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS id;`;
  const [result2] = await pool.execute(sql2);

  const reviewId = result2[0]["id"];
  return await getReview(reviewId);
};

const getReview = async function(reviewId) {
  const sql = `SELECT * FROM Reviews WHERE id = ${reviewId};`;
  const [reviewResult] = await pool.execute(sql);

  if (reviewResult.length == 0) {
    throw createError(
      404,
      `There is no reviews with review Id is ${reviewId};`
    );
  }

  return await reviews.convertToReview(reviewResult[0]);
};

const getListReviews = async function(listId) {
  const sql = `SELECT * FROM Reviews WHERE list_id = ${listId};`;
  const [reviewResult] = await pool.execute(sql);

  if (reviewResult.length == 0) {
    throw createError(404, `There is no reviews with list Id is ${listId};`);
  }

  const result = [];
  for (let i = 0; i < reviewResult.length; i++) {
    result.push(reviews.convertToReview(reviewResult[i]));
  }

  return await result;
};

const modifyReview = async function(reviewId, content, modifyTime) {
  const queries = [];

  queries.push(`content=\'${content}\'`);
  queries.push(`reg_date=\'${modifyTime}\'`);

  const sql = `UPDATE Reviews SET ${queries.join(
    ", "
  )} WHERE id = ${reviewId};`;
  const result = await pool.execute(sql);

  return await getReview(reviewId);
};

const deleteReview = async function(reviewId) {
  const sql1 = `DELETE FROM Reviews WHERE id = ${reviewId};`;

  const result1 = await pool.execute(sql1);

  return result1;
};

module.exports = {
  createReview,
  getReview,
  getListReviews,
  modifyReview,
  deleteReview
};
