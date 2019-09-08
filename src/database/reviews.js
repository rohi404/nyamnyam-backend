const createError = require('http-errors');
const database = require('../database/database')
const reviews = require('../model/reviews')

const createReview = async function (userId, listId, content, image) {
  const conn = database.createConnection();

  const sql1 = `INSERT INTO Reviews (user_id, list_id, content, image) VALUES ('${userId}', '${listId}', '${content}', '${image}');`;
  const result = await database.query(conn, sql1);

  const sql2 = `SELECT LAST_INSERT_ID() AS id;`;
  const result2 = await database.query(conn, sql2);

  database.endConnection(conn);

  const reviewId = result2[0]["id"];
  return await getReview(reviewId);
};

const getReview = async function (reviewId) {
  const sql = `SELECT * FROM Reviews WHERE id = ${reviewId};`;
  const reviewResult = await database.queryOne(sql);

  if (reviewResult.length == 0) {
    throw createError(404, `There is no reviews with review Id is ${reviewId};`);
  }

  return await reviews.convertToReview(reviewResult[0]);
};

const getListReviews = async function (listId) {
  const conn = database.createConnection();
  const sql = `SELECT * FROM Reviews WHERE list_id = ${listId};`;
  const reviewResult = await database.query(conn, sql);

  if (reviewResult.length == 0) {
    throw createError(404, `There is no reviews with list Id is ${listId};`);
  }

  const result = []
  for (let i = 0; i < reviewResult.length; i++) {
    result.push(reviews.convertToReview(reviewResult[i]));
  }

  return await result;
};

const modifyReview = async function (reviewId, content, modifyTime) {
  const queries = [];

  queries.push(`content=\'${content}\'`);
  queries.push(`reg_date=\'${modifyTime}\'`)

  const sql = `UPDATE Reviews SET ${queries.join(", ")} WHERE id = ${reviewId};`;
  const result = await database.queryOne(sql);

  return await getReview(reviewId);
};

const deleteReview = async function (reviewId) {
  const conn = database.createConnection();

  const sql1 = `DELETE FROM Reviews WHERE id = ${reviewId};`;

  const result1 = await database.query(conn, sql1);

  return result1;
};

module.exports = { createReview, getReview, getListReviews, modifyReview, deleteReview };