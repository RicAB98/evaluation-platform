const mysql = require('mysql');

const pool = mysql.createPool({
    host: '144.91.116.216',
    user: 'sczzpt_admin', 
    password: ',b-D66s&{K2a',
    database: 'sczzpt_database'
});

module.exports = {
  getConnection: (callback) => {
    return pool.getConnection(callback);
  } 
}