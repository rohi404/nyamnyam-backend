const mysql = require("mysql2");

const poolDB = mysql.createPool({
  host: process.env.RDS_HOST,
  database: process.env.RDS_DB,
  user: process.env.RDS_USER,
  password: process.env.RDS_PW,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const pool = poolDB.promise();

module.exports = pool;
