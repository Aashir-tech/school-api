const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// db.connect((err) => {
//     if(err) {
//         console.error("Error connecting with my sql " , err.stack);
//         return;
//     }

//     console.log("Connected with MySql")
// })

module.exports = db.promise()