var express = require('express');
const db = require('../database/db.js');
var router = express.Router();

router.post('/runeval', function(req, res, next) {
  db.getConnection((err, conn) => {

    let name = req.body.name
    let type = req.body.type[1]
    let period = req.body.period[1]
    let date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

    conn.query(`INSERT INTO Evaluation (name, type, period, date) VALUES ('${name}', '${type}', '${period}', '${date}')`, (error, results, fields) => {
      if (error)
      { 
        error_type = error.toString().substring(7,19)
        res.send(error_type);
      }
      else
        res.send("Evaluation created");
      conn.release();
    });
  });
});

router.get('/loadeval/:id', function(req, res, next) {
  let id = req.params.id

  res.send([
    [id, "Niger"],
    [id, "Curaçao"],
    [id, "Netherlands"],
    [id, "Korea, South"],
    [id, "Malawi"],
    [id, "Chile"]
  ]);
});

router.get('/geteval', function(req, res, next) {
  db.getConnection((err, conn) => {
    conn.query('SELECT * from Evaluation', (error, results, fields) => {
      if (err) throw err
  
      evaluations = []

      for (r of results)
       evaluations.push([r["id"], r["name"]])

      res.send(evaluations);
      conn.release();
    });
  });
});

router.get('/topqueries', function(req, res, next) {

  let startDate = new Date(req.query.startDate)
  let query = `select search_string, count(*) as n from fourdays where 
                 date = '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}' 
                 group by search_string order by count(*) DESC LIMIT 10`
  

  if(req.query.endDate != null)
  {
    startDate.setDate(startDate.getDate() - 1)
    endDate = new Date(req.query.endDate )
    endDate.setDate(endDate.getDate() + 1)

    query = `select search_string, count(*) as n from fourdays where 
              date > '${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}' and
              date < '${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}' 
              group by search_string order by count(*) DESC LIMIT 10`
  }
  
  db.getConnection((err, conn) => {
    conn.query(query, (error, results, fields) => {
      if (err) throw err

      res.send(results);
      conn.release();
    });
  })

});

module.exports = router;
