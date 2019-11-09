const createError = require("http-errors");
const pool = require("./database");
const reviews = require("../model/reviews");

const createReview = async function(userKey, listId, content, image) {
  try {
    const sql1 = `INSERT INTO Reviews (user_key, list_id, content, image) VALUES ('${userKey}', '${listId}', '${content}', '${image}');`;
    const result = await pool.execute(sql1);

    const reviewId = result[0].insertId;
    return await getReview(reviewId);
  } catch (e) {
    throw createError(e);
  }
};

const getReview = async function(reviewId) {
  try {
    const sql = `SELECT * FROM Reviews WHERE id = ${reviewId};`;
    const [reviewResult] = await pool.execute(sql);

    if (reviewResult.length == 0) {
      throw createError(
        404,
        `There is no reviews with review Id is ${reviewId};`
      );
    }

    return await reviews.convertToReview(reviewResult[0]);
  } catch (e) {
    throw createError(e);
  }
};

const getListReviews = async function(listId) {
  try {
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
  } catch (e) {
    throw createError(e);
  }
};

const modifyReview = async function(reviewId, content, modifyTime) {
  const queries = [];

  queries.push(`content=\'${content}\'`);
  queries.push(`reg_date=\'${modifyTime}\'`);

  const sql = `UPDATE Reviews SET ${queries.join(
    ", "
  )} WHERE id = ${reviewId};`;
  try {
    const result = await pool.execute(sql);

    return await getReview(reviewId);
  } catch (e) {
    throw createError(e);
  }
};

const deleteReview = async function(reviewId) {
  try {
    const sql1 = `DELETE FROM Reviews WHERE id = ${reviewId};`;

    const result1 = await pool.execute(sql1);

    return result1;
  } catch (e) {
    throw createError(e);
  }
};

module.exports = {
  createReview,
  getReview,
  getListReviews,
  modifyReview,
  deleteReview
};
