const mysql = require('mysql');
const credentials = require('../utills/credentials');

const createConnection = function() {
  return mysql.createConnection(credentials.mysqlConfig);
};

const query = function(conn, sql) {
  return new Promise(function (resolve, reject) {
    conn.query(sql, [], function (err, results, fields) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const endConnection = function (conn) {
  conn.end();
};

const queryOne = async function (sql) {
  const conn = createConnection();
  const results = await query(conn, sql);
  endConnection(conn);
  return results;
};

module.exports = { createConnection, endConnection, query, queryOne };